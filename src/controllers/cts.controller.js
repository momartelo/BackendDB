import { readFileSync, writeFileSync } from "fs";
import path from "path";

const dbPath = path.resolve("src/data/db.json");

function readDB() {
  return JSON.parse(readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

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
  const filtered = db.products.filter((p) => p.id != req.params.id);
  db.products = filtered;
  saveDB(db);
  res.json({ message: "Producto eliminado" });
};
