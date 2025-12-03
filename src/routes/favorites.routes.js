import express from "express";
const favRouter = express.Router();

import {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
  toggleFavorite,
} from "../controllers/favorites.controller.js";

favRouter.get("/:userId", getFavoritesByUser);
favRouter.post("/", addFavorite);
favRouter.delete("/", removeFavorite);
favRouter.post("/toggle", toggleFavorite);

export default favRouter;
