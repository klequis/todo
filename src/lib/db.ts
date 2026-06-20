import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

function getDbPath(): string {
  const explicit = process.env.TODO_DB_PATH;
  if (explicit) {
    return isAbsolute(explicit) ? explicit : resolve(process.cwd(), explicit);
  }

  const dataEnv = process.env.VITE_DATA_ENV ?? "dev";
  return join(process.cwd(), "data", dataEnv, "todo.db");
}

const dbPath = getDbPath();
const dbDir = dirname(dbPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS columns_tbl (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    position   INTEGER NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE TABLE IF NOT EXISTS cards (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    title          TEXT NOT NULL,
    notes_markdown TEXT NOT NULL DEFAULT '',
    column_id      TEXT NOT NULL REFERENCES columns_tbl(id) ON DELETE RESTRICT,
    position       INTEGER NOT NULL,
    created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_cards_column_position
    ON cards(column_id, position);

  CREATE TRIGGER IF NOT EXISTS cards_updated_at
    AFTER UPDATE ON cards
    FOR EACH ROW
    BEGIN
      UPDATE cards
      SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE id = OLD.id;
    END;
`);

db.prepare(
  `INSERT OR IGNORE INTO columns_tbl (id, name, position) VALUES
    ('backlog', 'Backlog', 0),
    ('today', 'Today', 1)`
).run();

export default db;
