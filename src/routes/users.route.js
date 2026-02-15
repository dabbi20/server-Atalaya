import { Router } from "express";
import { pool } from "../db.js";
import {getUsers} from '../controllers/users.controllers.js'

const router = Router();

// Helpers (para no repetir lógica)
const toInt = (value) => Number.parseInt(value, 10);
const isPositiveInt = (n) => Number.isInteger(n) && n > 0;

router.get("/users", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT clienteid, nombre, email, cell, servicio, plazo, mensaje, contacted, created_at FROM clientes ORDER BY clienteid ASC"
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("GET /users error:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/users/:id", async (req, res) => {
  const id = toInt(req.params.id);

  if (!isPositiveInt(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT clienteid, nombre, email, cell, servicio, plazo, mensaje, contacted, created_at FROM clientes WHERE clienteid = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("GET /users/:id error:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post("/users", async (req, res) => {
  const { nombre, email, cell, servicio, plazo, mensaje } = req.body;

  // Validación mínima (para que sea estable)
  if (!nombre || !email || !cell || !servicio || !plazo || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO clientes (nombre, email, cell, servicio, plazo, mensaje)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING clienteid, nombre, email, cell, servicio, plazo, mensaje, contacted, created_at`,
      [nombre, email, cell, servicio, plazo, mensaje]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /users error:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.delete("/users/:id", async (req, res) => {
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

    // 204 = borrado OK y sin body
    return res.status(204).send();
  } catch (err) {
    console.error("DELETE /users/:id error:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/users/:id", async (req, res) => {
  const id = toInt(req.params.id);

  if (!isPositiveInt(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const { nombre, email, cell, servicio, plazo, mensaje } = req.body;

  // PUT normalmente significa "reemplazar": exigimos todos los campos
  if (!nombre || !email || !cell || !servicio || !plazo || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE clientes
       SET nombre = $1,
           email = $2,
           cell = $3,
           servicio = $4,
           plazo = $5,
           mensaje = $6
       WHERE clienteid = $7
       RETURNING clienteid, nombre, email, cell, servicio, plazo, mensaje, contacted, created_at`,
      [nombre, email, cell, servicio, plazo, mensaje, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "cliente no encontrado" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("PUT /users/:id error:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
