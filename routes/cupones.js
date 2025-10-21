import { Router } from 'express';
import { pool } from '../server.js';
const r = Router();

r.post('/', async (req, res) => {
  const { vuelo_id, pasajero_id, valor = 5000, moneda = 'ARS', motivo = 'demora' } = req.body;
  try {
    const { rows: vuelo } = await pool.query(`select estado from vuelo where vuelo_id=$1`, [vuelo_id]);
    if (!vuelo[0]) return res.status(404).json({ error: 'vuelo no encontrado' });
    if (vuelo[0].estado !== 'demorado') return res.status(400).json({ error: 'vuelo no demorado' });

    const { rows } = await pool.query(
      `insert into cupon (vuelo_id, pasajero_id, motivo, valor, moneda)
       values ($1,$2,$3,$4,$5) returning *`,
      [vuelo_id, pasajero_id, motivo, valor, moneda]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default r;
