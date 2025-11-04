import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv"; //lee las variables del env

dotenv.config(); // Se cargan las credenciales del env
//el back ya puede leer las variables
const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT || 5432),
  ssl: { rejectUnauthorized: false }
});


app.get("/", async (_req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.send(`Conexión exitosa ✅ - Hora del servidor: ${r.rows[0].now}`);
  } catch (e) {
    console.error("Error de conexión:", e);
    res.status(500).send("Error al conectar con la base de datos");
  }
});


app.get("/api/vuelos/:numero", async (req, res) => {
  const numero = req.params.numero.trim().toUpperCase();
//consulta datos
  const query = `
    SELECT
      v.vuelo_id,
      v.numero_vuelo,
      v.fecha,
      TO_CHAR(v.salida_programada, 'HH24:MI') AS hora_salida,
      TO_CHAR(v.salida_estimada,   'HH24:MI') AS hora_estimada,
      NULL::text AS hora_llegada,
      ao.codigo  AS origen,
      ad.codigo  AS destino,
      v.estado
    FROM vuelo v 
    JOIN aeropuerto ao ON ao.aeropuerto_id = v.origen_id
    JOIN aeropuerto ad ON ad.aeropuerto_id = v.destino_id
    WHERE UPPER(TRIM(v.numero_vuelo)) = $1
    ORDER BY v.fecha DESC
    LIMIT 1
  `;
//SELECT From vuelo V = busca los datos en la tabla vuelo. Join Aeropuerto une la tabla aeropuerto con vuelo
//WHERE ... = $1 → busca el vuelo que tenga el número igual al que pasamos. 
  try {
    const { rows } = await pool.query(query, [numero]); 
    // Se decide la respuesta y devuelve JSON 
    if (rows.length === 0) {
      return res.status(404).json({ error: "Vuelo no encontrado" });
    }
    res.json(rows[0]); // manda el objeto al front como JSON
  } catch (e) {
    console.error("Error al consultar vuelo:", e);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.listen(Number(process.env.PORT || 3000), () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`);
});