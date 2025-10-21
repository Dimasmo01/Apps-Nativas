import { Router } from 'express';
import { pool } from '../server.js';
const r = Router();

r.post('/', async (req, res) => {
  const { vuelo_pasajero_id, asiento_id } = req.body;
  const client = await pool.connect();
  try {
    await client.query('begin');
    if (asiento_id) {
      await client.query(
        `update vuelo_pasajero set asiento_id=$2 where vuelo_pasajero_id=$1`,
        [vuelo_pasajero_id, asiento_id]
      );
    }
    const { rows } = await client.query(
      `insert into checkin (vuelo_pasajero_id) values ($1) returning *`,
      [vuelo_pasajero_id]
    );
    await client.query('commit');
    res.status(201).json(rows[0]);
  } catch (e) {
    await client.query('rollback');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

export default r;
