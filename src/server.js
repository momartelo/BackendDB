import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------------
// Corrección para obtener __dirname REAL
// ------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta correcta al db.json dentro del proyecto
const localDB = path.join(__dirname, "data", "db.json");

// Archivo JSON en /tmp (Render Free)
const tmpDB = "/tmp/db.json";

console.log("Ruta localDB:", localDB);
console.log("Existe localDB?", fs.existsSync(localDB));
console.log("Existe tmpDB antes?", fs.existsSync(tmpDB));

// Copiar db local → /tmp
if (!fs.existsSync(tmpDB)) {
  console.log("Copiando db inicial a /tmp...");
  try {
    const initial = fs.readFileSync(localDB, "utf8");
    fs.writeFileSync(tmpDB, initial);
    console.log("Copia realizada OK");
  } catch (err) {
    console.error("Error copiando:", err);
  }
} else {
  console.log("/tmp/db.json ya existe.");
}

console.log("Existe tmpDB después?", fs.existsSync(tmpDB));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use("/api/products", productsRoutes);

app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
