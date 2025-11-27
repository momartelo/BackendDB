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

  // Clonar el usuario para borrarle la contraseña antes de enviarlo
  const safeUser = { ...user };
  delete safeUser.password;

  res.json({
    message: "Login exitoso",
    user: safeUser,
  });
};

// -----------------------------------------------------------------------------
// 📝 REGISTRO
// -----------------------------------------------------------------------------
export const registerUser = (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email y password son obligatorios" });

  const db = readDB();
  if (!db.users) db.users = [];

  const exists = db.users.some((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "El email ya está registrado" });
  }

  const newUser = {
    id: generateId(db.users),
    name: name || "",
    email,
    password,
    role: "cliente",
    isActive: true,
    registerDate: new Date().toISOString(),
    lastLogin: null,
    address: null,
    phone: null,
    birthDate: null,
    gender: null,
  };

  db.users.push(newUser);
  writeDB(db);

  const safeUser = { ...newUser };
  delete safeUser.password;

  res.json({
    message: "Usuario registrado",
    user: safeUser,
  });
};

// -----------------------------------------------------------------------------
// 👀 (Opcional) ver todos los usuarios
// -----------------------------------------------------------------------------
export const getAllUsers = (req, res) => {
  const db = readDB();
  res.json(db.users || []);
};
