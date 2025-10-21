import { Router } from 'express';
import { pool } from '../server.js';
const r = Router();

r.get('/', async (req, res) => {
  const { numero, fecha } = req.query;
  try {
    const { rows } = await pool.query(
      `select * from vuelo
       where ($1::text is null or numero_vuelo = $1)
         and ($2::date is null or fecha = $2)
       order by fecha desc`,
      [numero || null, fecha || null]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

r.get('/:id', async (req, res) => {
  try {
    const { rows: vuelo } = await pool.query(`select * from vuelo where vuelo_id=$1`, [req.params.id]);
    const { rows: pax } = await pool.query(
      `select vp.vuelo_pasajero_id, p.pasajero_id, p.nombre, p.apellido, p.documento, vp.asiento_id
       from vuelo_pasajero vp
       join pasajero p on p.pasajero_id = vp.pasajero_id
       where vp.vuelo_id = $1`, [req.params.id]);
    res.json({ vuelo: vuelo[0], pasajeros: pax });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

r.put('/:id/estado', async (req, res) => {
  const { estado, hora_est_salida, puerta } = req.body;
  try {
    const { rows } = await pool.query(
      `update vuelo
         set estado = coalesce($2, estado),
             hora_est_salida = coalesce($3::time, hora_est_salida),
             puerta = coalesce($4, puerta)
       where vuelo_id = $1
       returning *`,
       [req.params.id, estado || null, hora_est_salida || null, puerta || null]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

r.get('/status/:numero', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `select numero_vuelo, fecha, estado, hora_prog_salida, hora_est_salida, puerta
         from vuelo where numero_vuelo=$1
         order by fecha desc limit 1`,
      [req.params.numero]
    );
    res.json(rows[0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default r;
