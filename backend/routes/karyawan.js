const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/karyawan
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_karyawan, nama_karyawan, role, username FROM karyawan');
    res.json(rows);
  } catch (err) {
    console.error('Get karyawan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/karyawan
router.post('/', async (req, res) => {
  try {
    const { nama_karyawan, role, username, password } = req.body;
    const [result] = await db.query(
      'INSERT INTO karyawan (nama_karyawan, role, username, password) VALUES (?, ?, ?, ?)',
      [nama_karyawan, role || 'Kasir', username, password]
    );
    res.json({ success: true, id_karyawan: result.insertId });
  } catch (err) {
    console.error('Create karyawan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/karyawan/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_karyawan, username } = req.body;
    
    // Note: We don't update password here for simplicity, can be added later if needed
    const [result] = await db.query(
      'UPDATE karyawan SET nama_karyawan = ?, username = ? WHERE id_karyawan = ?',
      [nama_karyawan, username, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Karyawan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Data karyawan berhasil diupdate' });
  } catch (err) {
    console.error('Update karyawan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/karyawan/:id/role
router.put('/:id/role', async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;
    
    const [result] = await db.query(
      'UPDATE karyawan SET role = ? WHERE id_karyawan = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Karyawan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Role karyawan berhasil diupdate' });
  } catch (err) {
    console.error('Update role karyawan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/karyawan/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if karyawan has related penjualan records
    const [penjualan] = await db.query('SELECT COUNT(*) as count FROM penjualan WHERE id_karyawan = ?', [id]);
    if (penjualan[0].count > 0) {
      return res.status(400).json({ error: 'Tidak dapat menghapus karyawan. Karyawan ini sudah memiliki riwayat transaksi penjualan.' });
    }

    const [result] = await db.query('DELETE FROM karyawan WHERE id_karyawan = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Karyawan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Karyawan berhasil dihapus' });
  } catch (err) {
    console.error('Delete karyawan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
