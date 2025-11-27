// src/controllers/users.controller.js
import { readDB, writeDB } from "../db.js";

// 🔧 Generar ID incremental
function generateId(users) {
  const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;
  return maxId + 1;
}

// -----------------------------------------------------------------------------
// 🔐 LOGIN
// -----------------------------------------------------------------------------
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  const db = readDB();
  if (!db.users) db.users = [];

  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  res.json({
    message: "Login exitoso",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

// -----------------------------------------------------------------------------
// 📝 REGISTRO
// -----------------------------------------------------------------------------
export const registerUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email y password son obligatorios" });

  const db = readDB();
  if (!db.users) db.users = [];

  // Verificar email existente
  const exists = db.users.some((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "El email ya está registrado" });
  }

  const newUser = {
    id: generateId(db.users),
    email,
    password, // SIN bcrypt porque no lo vieron
    role: "user",
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({
    message: "Usuario registrado",
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
  });
};

// -----------------------------------------------------------------------------
// 👀 (Opcional) ver todos los usuarios
// -----------------------------------------------------------------------------
export const getAllUsers = (req, res) => {
  const db = readDB();
  res.json(db.users || []);
};
