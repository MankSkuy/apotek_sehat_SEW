const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/batch-obat — Daftar semua batch + join nama obat
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.id_batch_obat,
        b.id_obat,
        o.nama_obat,
        o.kategori_obat,
        o.stok_minimal,
        o.satuan,
        b.jumlah_stok,
        b.harga_beli,
        b.harga_jual,
        b.tanggal_expired,
        DATEDIFF(b.tanggal_expired, CURDATE()) AS sisa_hari
      FROM batch_obat b
      JOIN obat o ON b.id_obat = o.id_obat
      WHERE b.jumlah_stok > 0 AND b.tanggal_expired >= CURDATE()
      ORDER BY b.tanggal_expired ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get batch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/batch-obat/warnings — Stok menipis & mendekati kadaluarsa
router.get('/warnings', async (req, res) => {
  try {
    // Stok menipis: total stok obat <= stok_minimal
    const [stokMenipis] = await db.query(`
      SELECT 
        o.id_obat,
        o.nama_obat,
        o.stok_minimal,
        COALESCE(SUM(b.jumlah_stok), 0) AS total_stok
      FROM obat o
      LEFT JOIN batch_obat b ON o.id_obat = b.id_obat
      GROUP BY o.id_obat, o.nama_obat, o.stok_minimal
      HAVING total_stok <= o.stok_minimal AND total_stok > 0
    `);

    // Mendekati kadaluarsa: expired dalam 30 hari ke depan
    const [hampirExpired] = await db.query(`
      SELECT 
        b.id_batch_obat,
        o.nama_obat,
        b.tanggal_expired,
        b.jumlah_stok,
        DATEDIFF(b.tanggal_expired, CURDATE()) AS sisa_hari
      FROM batch_obat b
      JOIN obat o ON b.id_obat = o.id_obat
      WHERE b.tanggal_expired BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND b.jumlah_stok > 0
      ORDER BY b.tanggal_expired ASC
    `);

    res.json({
      stok_menipis: stokMenipis,
      hampir_expired: hampirExpired,
      total_warnings: stokMenipis.length + hampirExpired.length
    });
  } catch (err) {
    console.error('Get warnings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/batch-obat/summary — KPI cards data
router.get('/summary', async (req, res) => {
  try {
    // Total item obat (jumlah jenis obat unik)
    const [[{ total_item }]] = await db.query('SELECT COUNT(*) AS total_item FROM obat');

    // Stok menipis count
    const [[{ stok_menipis }]] = await db.query(`
      SELECT COUNT(*) AS stok_menipis FROM (
        SELECT o.id_obat
        FROM obat o
        LEFT JOIN batch_obat b ON o.id_obat = b.id_obat
        GROUP BY o.id_obat, o.stok_minimal
        HAVING COALESCE(SUM(b.jumlah_stok), 0) <= o.stok_minimal 
          AND COALESCE(SUM(b.jumlah_stok), 0) > 0
      ) sub
    `);

    // Estimasi nilai stok (total harga_jual * jumlah_stok)
    const [[{ estimasi_nilai }]] = await db.query(`
      SELECT COALESCE(SUM(b.harga_jual * b.jumlah_stok), 0) AS estimasi_nilai
      FROM batch_obat b
      WHERE b.jumlah_stok > 0
    `);

    // Hampir kadaluarsa (dalam 30 hari)
    const [[{ hampir_expired }]] = await db.query(`
      SELECT COUNT(*) AS hampir_expired
      FROM batch_obat b
      WHERE b.tanggal_expired BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        AND b.jumlah_stok > 0
    `);

    res.json({
      total_item,
      stok_menipis,
      estimasi_nilai,
      hampir_expired
    });
  } catch (err) {
    console.error('Get summary error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/batch-obat — Tambah batch obat baru (multi-item)
router.post('/', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { items } = req.body; // array of { id_obat, jumlah_stok, tanggal_expired, harga_beli, harga_jual }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Minimal 1 item obat harus diisi' });
    }

    const insertedIds = [];
    for (const item of items) {
      const [result] = await conn.query(
        'INSERT INTO batch_obat (id_obat, jumlah_stok, tanggal_expired, harga_beli, harga_jual) VALUES (?, ?, ?, ?, ?)',
        [item.id_obat, item.jumlah_stok, item.tanggal_expired, item.harga_beli, item.harga_jual]
      );
      insertedIds.push(result.insertId);
    }

    await conn.commit();
    res.json({ success: true, batch_ids: insertedIds });
  } catch (err) {
    await conn.rollback();
    console.error('Create batch error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    conn.release();
  }
});

// PUT /api/batch-obat/:id — Update stok batch
router.put('/:id', async (req, res) => {
  try {
    const { jumlah_stok } = req.body;
    await db.query(
      'UPDATE batch_obat SET jumlah_stok = jumlah_stok + ? WHERE id_batch_obat = ?',
      [jumlah_stok, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Update batch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
