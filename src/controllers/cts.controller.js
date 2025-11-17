import { readFileSync, writeFileSync } from "fs";

function readDB(dbPath) {
  return JSON.parse(readFileSync(dbPath, "utf8"));
}

function saveDB(dbPath, data) {
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export const getProducts = (req, res) => {
  const db = readDB(req.dbPath);
  res.json(db.products);
};

export const getProduct = (req, res) => {
  const db = readDB(req.dbPath);
  const product = db.products.find((p) => p.id == req.params.id);
  res.json(product || {});
};

export const createProduct = (req, res) => {
  const db = readDB(req.dbPath);
  const newProduct = { id: Date.now(), ...req.body };
  db.products.push(newProduct);
  saveDB(req.dbPath, db);
  res.json(newProduct);
};

export const updateProduct = (req, res) => {
  const db = readDB(req.dbPath);
  const index = db.products.findIndex((p) => p.id == req.params.id);

  if (index === -1) return res.status(404).json({ error: "No encontrado" });

  db.products[index] = { ...db.products[index], ...req.body };
  saveDB(req.dbPath, db);
  res.json(db.products[index]);
};

export const deleteProduct = (req, res) => {
  const db = readDB(req.dbPath);
  db.products = db.products.filter((p) => p.id != req.params.id);
  saveDB(req.dbPath, db);
  res.json({ message: "Producto eliminado" });
};
