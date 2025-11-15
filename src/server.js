import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use("/api/products", productsRoutes);

app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
