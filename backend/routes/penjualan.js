const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/penjualan — Riwayat transaksi penjualan
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_penjualan,
        p.waktu_transaksi,
        p.total_belanja,
        k.nama_karyawan,
        COUNT(dp.id_detail_penjualan) as jumlah_item
      FROM penjualan p
      LEFT JOIN karyawan k ON p.id_karyawan = k.id_karyawan
      LEFT JOIN detail_penjualan dp ON p.id_penjualan = dp.id_penjualan
      GROUP BY p.id_penjualan, p.waktu_transaksi, p.total_belanja, k.nama_karyawan
      ORDER BY p.waktu_transaksi DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get penjualan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/penjualan — Buat transaksi penjualan baru
router.post('/', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { id_karyawan, total_belanja, items } = req.body;
    
    // items: array of { id_obat, qty, subtotal, harga_jual }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Keranjang kosong' });
    }

    // 1. Insert into penjualan
    const [resPenjualan] = await conn.query(
      'INSERT INTO penjualan (id_karyawan, waktu_transaksi, total_belanja) VALUES (?, NOW(), ?)',
      [id_karyawan, total_belanja]
    );
    const idPenjualan = resPenjualan.insertId;

    // 2. Insert into jurnal_keuangan
    await conn.query(
      'INSERT INTO jurnal_keuangan (tanggal, tipe_transaksi, nominal, id_penjualan, keterangan) VALUES (CURDATE(), ?, ?, ?, ?)',
      ['Pendapatan Penjualan', total_belanja, idPenjualan, 'Penjualan Obat via POS']
    );

    // 3. Process each item (FIFO logic for batch_obat)
    for (const item of items) {
      let qtyNeeded = item.qty;
      
      // Get available batches for this obat, ordered by nearest expiration
      const [batches] = await conn.query(
        'SELECT id_batch_obat, jumlah_stok FROM batch_obat WHERE id_obat = ? AND jumlah_stok > 0 ORDER BY tanggal_expired ASC',
        [item.id_obat]
      );

      for (const batch of batches) {
        if (qtyNeeded <= 0) break;

        const qtyToTake = Math.min(qtyNeeded, batch.jumlah_stok);
        const subtotal = qtyToTake * item.harga_jual;

        // Insert detail_penjualan
        await conn.query(
          'INSERT INTO detail_penjualan (id_penjualan, id_batch, qty_jual, subtotal) VALUES (?, ?, ?, ?)',
          [idPenjualan, batch.id_batch_obat, qtyToTake, subtotal]
        );

        // Update batch_obat stock
        await conn.query(
          'UPDATE batch_obat SET jumlah_stok = jumlah_stok - ? WHERE id_batch_obat = ?',
          [qtyToTake, batch.id_batch_obat]
        );

        qtyNeeded -= qtyToTake;
      }

      if (qtyNeeded > 0) {
         throw new Error(`Stok tidak mencukupi untuk obat ID: ${item.id_obat}`);
      }
    }

    await conn.commit();
    res.json({ success: true, id_penjualan: idPenjualan });
  } catch (err) {
    await conn.rollback();
    console.error('Create penjualan error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;
