import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname real
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta local normal
let dbPath = path.join(__dirname, "..", "data", "db.json");

// Si estamos en Render, usar /tmp/db.json
if (process.env.RENDER) {
  dbPath = "/tmp/db.json";
}

console.log("dbPath usado:", dbPath);

function readDB() {
  return JSON.parse(readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ==================== PRODUCTS ====================

export const getProducts = (req, res) => {
  const db = readDB();
  res.json(db.products);
};

export const getProduct = (req, res) => {
  const db = readDB();
  const product = db.products.find((p) => p.id == req.params.id);
  res.json(product || {});
};

export const createProduct = (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Date.now(),
    ...req.body,
  };
  db.products.push(newProduct);
  saveDB(db);
  res.json(newProduct);
};

export const updateProduct = (req, res) => {
  const db = readDB();
  const index = db.products.findIndex((p) => p.id == req.params.id);

  if (index === -1) return res.status(404).json({ error: "No encontrado" });

  db.products[index] = { ...db.products[index], ...req.body };
  saveDB(db);
  res.json(db.products[index]);
};

export const deleteProduct = (req, res) => {
  const db = readDB();
  db.products = db.products.filter((p) => p.id != req.params.id);
  saveDB(db);
  res.json({ message: "Producto eliminado" });
};
