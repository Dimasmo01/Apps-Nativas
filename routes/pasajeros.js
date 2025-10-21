import { Router } from 'express';
import { pool } from '../server.js';
const r = Router();

r.get('/:documento', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `select p.*, u.username
         from pasajero p left join usuario u on u.usuario_id = p.usuario_id
        where p.documento = $1`, [req.params.documento]);
    res.json(rows[0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default r;
