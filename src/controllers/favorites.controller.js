// src/controllers/favoritesController.js
import { readDB, writeDB } from "../db.js";

// GET favoritos del usuario
export const getFavoritesByUser = (req, res) => {
  const userId = Number(req.params.userId);

  const db = readDB();
  const favorites = db.favorites?.filter((f) => f.userId === userId) || [];

  res.json(favorites);
};

// POST agregar favorito
export const addFavorite = (req, res) => {
  const { userId, productId } = req.body;
  const userIdNum = Number(userId);
  const productIdNum = Number(productId);

  if (!userIdNum || !productIdNum) {
    return res.status(400).json({ error: "userId y productId requeridos" });
  }

  const db = readDB();
  if (!db.favorites) db.favorites = [];

  const exists = db.favorites.some(
    (f) => f.userId === userIdNum && f.productId === productIdNum
  );

  if (!exists) {
    db.favorites.push({ userId: userIdNum, productId: productIdNum });
    writeDB(db);
  }

  res.json({ ok: true });
};

// DELETE eliminar favorito
export const removeFavorite = (req, res) => {
  const { userId, productId } = req.body;
  const userIdNum = Number(userId);
  const productIdNum = Number(productId);

  const db = readDB();

  db.favorites = db.favorites.filter(
    (f) => !(f.userId === userIdNum && f.productId === productIdNum)
  );

  writeDB(db);

  res.json({ ok: true });
};

export const toggleFavorite = (req, res) => {
  const { userId, productId } = req.body;
  const db = readDB();
  if (!db.favorites) db.favorites = [];

  const exists = db.favorites.some(
    (f) => f.userId === Number(userId) && f.productId === Number(productId)
  );

  if (exists) {
    db.favorites = db.favorites.filter(
      (f) => !(f.userId === Number(userId) && f.productId === Number(productId))
    );
    writeDB(db);
    return res.json({ message: "Favorito eliminado" });
  }

  db.favorites.push({ userId: Number(userId), productId: Number(productId) });
  writeDB(db);
  res.json({ message: "Favorito agregado" });
};
