import { Database } from "bun:sqlite";
import { readFileSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.DATABASE_PATH || join(import.meta.dir, "../../data/platform.db");

const db = new Database(DB_PATH, { create: true });
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

const schema = readFileSync(join(import.meta.dir, "schema.sql"), "utf-8");
db.exec(schema);

export default db;
