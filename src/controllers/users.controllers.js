import { pool } from "../db.js";

// 1) Helpers pequeños (reutilizables) para mantener el código limpio
const toInt = (value) => Number.parseInt(value, 10);
const isPositiveInt = (n) => Number.isInteger(n) && n > 0;

// 2) Una lista fija de columnas para NO usar SELECT *
const SELECT_CLIENTE_FIELDS = `
  clienteid, nombre, email, cell, servicio, plazo, mensaje, contacted, created_at
`;

// 3) GET /users  -> Traer todos
export const getUsers = async (req, res) => {
  try {
    const query = `
      SELECT ${SELECT_CLIENTE_FIELDS}
      FROM clientes
      ORDER BY clienteid ASC
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("getUsers error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 4) GET /users/:id -> Traer uno por id
export const getUserById = async (req, res) => {
  const id = toInt(req.params.id);

  if (!isPositiveInt(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const query = `
      SELECT ${SELECT_CLIENTE_FIELDS}
      FROM clientes
      WHERE clienteid = $1
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 5) POST /users -> Crear
export const createUser = async (req, res) => {
  const { nombre, email, cell, servicio, plazo, mensaje } = req.body;

  // Validación mínima: tu tabla tiene NOT NULL en esos campos
  if (!nombre || !email || !cell || !servicio || !plazo || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const query = `
      INSERT INTO clientes (nombre, email, cell, servicio, plazo, mensaje)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${SELECT_CLIENTE_FIELDS}
    `;

    const values = [nombre, email, cell, servicio, plazo, mensaje];
    const { rows } = await pool.query(query, values);

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 6) PUT /users/:id -> Actualizar (reemplazo completo)
export const updateUser = async (req, res) => {
  const id = toInt(req.params.id);

  if (!isPositiveInt(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const { nombre, email, cell, servicio, plazo, mensaje } = req.body;

  // PUT = normalmente requiere todos los campos
  if (!nombre || !email || !cell || !servicio || !plazo || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const query = `
      UPDATE clientes
      SET nombre = $1,
          email = $2,
          cell = $3,
          servicio = $4,
          plazo = $5,
          mensaje = $6
      WHERE clienteid = $7
      RETURNING ${SELECT_CLIENTE_FIELDS}
    `;

    const values = [nombre, email, cell, servicio, plazo, mensaje, id];
    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 7) DELETE /users/:id -> Eliminar
export const deleteUser = async (req, res) => {
  const id = toInt(req.params.id);

  if (!isPositiveInt(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM clientes WHERE clienteid = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // 204 = ok sin contenido
    return res.status(204).send();
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

