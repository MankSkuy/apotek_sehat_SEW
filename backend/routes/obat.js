const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/obat — Daftar obat + total stok dari semua batch
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id_obat,
        o.nama_obat,
        o.kategori_obat,
        o.stok_minimal,
        o.satuan,
        COALESCE(SUM(b.jumlah_stok), 0) AS total_stok,
        MIN(b.harga_jual) AS harga_jual,
        MIN(b.harga_beli) AS harga_beli
      FROM obat o
      LEFT JOIN batch_obat b ON o.id_obat = b.id_obat AND b.jumlah_stok > 0
      GROUP BY o.id_obat, o.nama_obat, o.kategori_obat, o.stok_minimal, o.satuan
      ORDER BY o.nama_obat ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get obat error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/obat/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM obat WHERE id_obat = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Obat tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get obat by id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/obat — Tambah obat baru
router.post('/', async (req, res) => {
  try {
    const { nama_obat, kategori_obat, stok_minimal, satuan } = req.body;
    const [result] = await db.query(
      'INSERT INTO obat (nama_obat, kategori_obat, stok_minimal, satuan) VALUES (?, ?, ?, ?)',
      [nama_obat, kategori_obat, stok_minimal || 10, satuan || 'tablet']
    );
    res.json({ success: true, id_obat: result.insertId });
  } catch (err) {
    console.error('Create obat error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/obat/:id — Update obat
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_obat, kategori_obat, stok_minimal, satuan } = req.body;
    
    const [result] = await db.query(
      'UPDATE obat SET nama_obat = ?, kategori_obat = ?, stok_minimal = ?, satuan = ? WHERE id_obat = ?',
      [nama_obat, kategori_obat, stok_minimal, satuan, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Obat tidak ditemukan' });
    }
    res.json({ success: true, message: 'Data obat berhasil diupdate' });
  } catch (err) {
    console.error('Update obat error:', err);
    res.status(500).json({ error: 'Server error saat update obat' });
  }
});

// DELETE /api/obat/:id — Hapus obat
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Check if obat is used in batch_obat
    const [batches] = await db.query('SELECT COUNT(*) as count FROM batch_obat WHERE id_obat = ?', [id]);
    if (batches[0].count > 0) {
      return res.status(400).json({ error: 'Tidak dapat menghapus obat. Obat ini sudah memiliki riwayat stok batch.' });
    }

    // Check if obat is used in detail_penjualan
    const [penjualan] = await db.query('SELECT COUNT(*) as count FROM detail_penjualan WHERE id_obat = ?', [id]);
    if (penjualan[0].count > 0) {
      return res.status(400).json({ error: 'Tidak dapat menghapus obat. Obat ini sudah memiliki riwayat penjualan.' });
    }

    const [result] = await db.query('DELETE FROM obat WHERE id_obat = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Obat tidak ditemukan' });
    }
    res.json({ success: true, message: 'Obat berhasil dihapus' });
  } catch (err) {
    console.error('Delete obat error:', err);
    res.status(500).json({ error: 'Server error saat menghapus obat' });
  }
});

module.exports = router;
