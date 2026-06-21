const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const obatRoutes = require('./routes/obat');
const batchRoutes = require('./routes/batch');
const penjualanRoutes = require('./routes/penjualan');
const laporanRoutes = require('./routes/laporan');
const karyawanRoutes = require('./routes/karyawan');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:4200'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/obat', obatRoutes);
app.use('/api/batch-obat', batchRoutes);
app.use('/api/penjualan', penjualanRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/karyawan', karyawanRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Apotek Sehat API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
