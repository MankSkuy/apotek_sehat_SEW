const express = require('express');
const router = express.Router();
const db = require('../config/database');

console.log('✅ authRoutes loaded');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('➡️  /api/auth/login hit with body:', req.body);
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi!' });
    }

    const [rows] = await db.query(
      'SELECT id_karyawan, nama_karyawan, role, username FROM karyawan WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah!' });
    }

    const user = rows[0];
    res.json({
      success: true,
      user: {
        id_karyawan: user.id_karyawan,
        nama: user.nama_karyawan,
        role: user.role,
        username: user.username
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  console.log('➡️  /api/auth/register hit with body:', req.body);
  try {
    const { nama_karyawan, username, password } = req.body;

    if (!nama_karyawan || !username || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi!' });
    }

    // Cek username sudah dipakai
    const [existing] = await db.query(
      'SELECT id_karyawan FROM karyawan WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username sudah digunakan, coba yang lain!' });
    }

    const [result] = await db.query(
      'INSERT INTO karyawan (nama_karyawan, role, username, password) VALUES (?, ?, ?, ?)',
      [nama_karyawan, 'Karyawan', username, password]
    );

    res.json({
      success: true,
      message: 'Akun berhasil didaftarkan',
      id_karyawan: result.insertId
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;