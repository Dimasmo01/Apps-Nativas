import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
import vuelosRouter from './routes/vuelos.js';
import pasajerosRouter from './routes/pasajeros.js';
import checkinRouter from './routes/checkin.js';
import cuponesRouter from './routes/cupones.js';

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.PGHOST && process.env.PGHOST.includes('supabase') ? { rejectUnauthorized: false } : false
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try { await pool.query('select 1'); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.use('/api/vuelos', vuelosRouter);
app.use('/api/pasajeros', pasajerosRouter);
app.use('/api/checkin', checkinRouter);
app.use('/api/cupones', cuponesRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Backend escuchando en http://localhost:${port}`));
