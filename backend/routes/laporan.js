const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper to get date condition based on periode
const getDateCondition = (periode) => {
  switch (periode) {
    case 'hari_ini':
      return 'DATE(waktu_transaksi) = CURDATE()';
    case '7_hari':
      return 'waktu_transaksi >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    case '30_hari':
      return 'waktu_transaksi >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    default:
      return 'DATE(waktu_transaksi) = CURDATE()';
  }
};

const getJurnalDateCondition = (periode) => {
  switch (periode) {
    case 'hari_ini':
      return 'tanggal = CURDATE()';
    case '7_hari':
      return 'tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    case '30_hari':
      return 'tanggal >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    default:
      return 'tanggal = CURDATE()';
  }
};

// GET /api/laporan/summary?periode=hari_ini
router.get('/summary', async (req, res) => {
  try {
    const periode = req.query.periode || 'hari_ini';
    const dateCond = getDateCondition(periode);
    const jurnalDateCond = getJurnalDateCondition(periode);

    // Total Pendapatan
    const [[{ total_pendapatan }]] = await db.query(`
      SELECT COALESCE(SUM(nominal), 0) as total_pendapatan 
      FROM jurnal_keuangan 
      WHERE tipe_transaksi = 'Pendapatan Penjualan' AND ${jurnalDateCond}
    `);

    // Total Transaksi
    const [[{ total_transaksi }]] = await db.query(`
      SELECT COUNT(id_penjualan) as total_transaksi 
      FROM penjualan 
      WHERE ${dateCond}
    `);

    // Item Terjual
    const [[{ item_terjual }]] = await db.query(`
      SELECT COALESCE(SUM(dp.qty_jual), 0) as item_terjual 
      FROM detail_penjualan dp
      JOIN penjualan p ON dp.id_penjualan = p.id_penjualan
      WHERE ${dateCond}
    `);

    res.json({
      total_pendapatan,
      total_transaksi,
      item_terjual
    });

  } catch (err) {
    console.error('Get laporan summary error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/laporan/transaksi?periode=hari_ini
router.get('/transaksi', async (req, res) => {
  try {
    const periode = req.query.periode || 'hari_ini';
    const dateCond = getDateCondition(periode);

    // Get transactions with concatenated items string
    const [rows] = await db.query(`
      SELECT 
        p.id_penjualan,
        p.waktu_transaksi,
        p.total_belanja,
        GROUP_CONCAT(CONCAT(o.nama_obat, ' (', dp.qty_jual, 'x)') SEPARATOR ', ') as detail_item,
        SUM(dp.qty_jual) as jumlah_item
      FROM penjualan p
      JOIN detail_penjualan dp ON p.id_penjualan = dp.id_penjualan
      JOIN batch_obat b ON dp.id_batch = b.id_batch_obat
      JOIN obat o ON b.id_obat = o.id_obat
      WHERE ${dateCond}
      GROUP BY p.id_penjualan, p.waktu_transaksi, p.total_belanja
      ORDER BY p.waktu_transaksi DESC
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Get laporan transaksi error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/laporan/chart?periode=hari_ini
router.get('/chart', async (req, res) => {
  try {
    const periode = req.query.periode || '7_hari';
    const dateCond = getDateCondition(periode);

    let query = '';
    if (periode === 'hari_ini') {
      // Group sales by hour for today
      query = `
        SELECT 
          CONCAT(DATE(waktu_transaksi), 'T', LPAD(HOUR(waktu_transaksi), 2, '0'), ':00:00') as tanggal,
          SUM(total_belanja) as total_pendapatan
        FROM penjualan
        WHERE ${dateCond}
        GROUP BY HOUR(waktu_transaksi), DATE(waktu_transaksi)
        ORDER BY HOUR(waktu_transaksi) ASC
      `;
    } else {
      // Group sales by date for other periods
      query = `
        SELECT 
          DATE(waktu_transaksi) as tanggal,
          SUM(total_belanja) as total_pendapatan
        FROM penjualan
        WHERE ${dateCond}
        GROUP BY DATE(waktu_transaksi)
        ORDER BY tanggal ASC
      `;
    }

    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Get laporan chart error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/laporan/buku-besar?periode=hari_ini
router.get('/buku-besar', async (req, res) => {
  try {
    const periode = req.query.periode || '30_hari';
    const dateCond = getJurnalDateCondition(periode);

    const [rows] = await db.query(`
      SELECT 
        id_jurnal,
        tanggal,
        tipe_transaksi,
        nominal,
        id_penjualan,
        id_pembelian,
        keterangan
      FROM jurnal_keuangan
      WHERE ${dateCond}
      ORDER BY tanggal DESC, id_jurnal DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get buku besar error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/laporan/sync-sheets
router.post('/sync-sheets', async (req, res) => {
  try {
    const { googleSheetsService } = require('../config/googleSheets');
    
    // Get all records for buku besar
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal,
        tipe_transaksi,
        COALESCE(id_penjualan, id_pembelian, '-') as id_referensi,
        keterangan,
        IF(tipe_transaksi = 'Pendapatan Penjualan', nominal, 0) as debit,
        IF(tipe_transaksi != 'Pendapatan Penjualan', nominal, 0) as kredit
      FROM jurnal_keuangan
      ORDER BY tanggal ASC, id_jurnal ASC
    `);

    // Prepare data for Sheets (header + rows)
    const values = [
      ['Tanggal', 'Tipe Transaksi', 'ID Referensi', 'Keterangan', 'Debit', 'Kredit']
    ];
    
    rows.forEach(row => {
      values.push([
        row.tanggal,
        row.tipe_transaksi,
        row.id_referensi,
        row.keterangan,
        row.debit,
        row.kredit
      ]);
    });

    await googleSheetsService.syncData(values);
    res.json({ success: true, message: 'Data berhasil disinkronisasi ke Google Sheets' });
  } catch (err) {
    console.error('Sync sheets error:', err);
    res.status(500).json({ error: err.message || 'Gagal sinkronisasi ke Google Sheets' });
  }
});

module.exports = router;
