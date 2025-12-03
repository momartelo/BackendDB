import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DB = path.join(__dirname, "data", "db.json");
const TMP_DB = "/tmp/db.json";

const isRender = process.env.RENDER;

const DB_PATH = isRender ? TMP_DB : LOCAL_DB;

if (isRender && !fs.existsSync(TMP_DB)) {
  fs.copyFileSync(LOCAL_DB, TMP_DB);
  console.log("DB copiada a /tmp");
}

export function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw);
}

export function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
