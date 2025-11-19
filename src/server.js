import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";
import fs from "fs";
import path from "path";
import favRouter from "./routes/favorites.routes.js";

// Detectar si estamos en Render (producción)
const isRender = process.env.RENDER === "true";

// Seleccionar archivo correcto
const dbPath = isRender
  ? "/tmp/db.json" // Render → escritura permitida
  : path.join(process.cwd(), "src/data/temp.json"); // Local → temp.json

const sourceDB = path.join(process.cwd(), "src/data/db.json");

// Crear archivo inicial si no existe
function initializeDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.copyFileSync(sourceDB, dbPath);
      console.log("DB inicial copiada:", dbPath);
      return;
    }

    const content = fs.readFileSync(dbPath, "utf8");
    if (!content || content.trim() === "" || content === "{}") {
      fs.copyFileSync(sourceDB, dbPath);
      console.log("DB vacía → restaurada desde db.json");
    }
  } catch (err) {
    console.error("Error inicializando DB:", err);
  }
}

initializeDB();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para que los controladores sepan qué DB usar
app.use((req, res, next) => {
  req.dbPath = dbPath;
  next();
});

app.use("/favorites", favRouter);

// -----------------------------------------------------------

// Ver contenido actual de la DB (temp.json o /tmp/db.json)
app.get("/debug/db", (req, res) => {
  try {
    const contenido = fs.readFileSync(req.dbPath, "utf8");
    res.setHeader("Content-Type", "application/json");
    res.send(contenido);
  } catch (err) {
    res.status(500).send("Error leyendo DB: " + err.message);
  }
});

// Ver qué archivo está usando la app como DB
app.get("/debug/path", (req, res) => {
  res.json({
    renderMode: process.env.RENDER,
    dbPath: req.dbPath,
    exists: fs.existsSync(req.dbPath),
  });
});

// --------------------------------------------------------

const PORT = process.env.PORT || 3001;

app.use("/api/products", productsRoutes);

app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
