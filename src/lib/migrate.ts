import type { Client } from "@libsql/client";

export async function runMigration(client: Client): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS columns_tbl (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      position   INTEGER NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS cards (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      title          TEXT NOT NULL,
      notes_markdown TEXT NOT NULL DEFAULT '',
      column_id      TEXT NOT NULL REFERENCES columns_tbl(id) ON DELETE RESTRICT,
      position       INTEGER NOT NULL,
      created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `);

  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_cards_column_position
      ON cards(column_id, position)
  `);

  await client.execute(`
    CREATE TRIGGER IF NOT EXISTS cards_updated_at
      AFTER UPDATE ON cards
      FOR EACH ROW
      BEGIN
        UPDATE cards
        SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = OLD.id;
      END
  `);

  await client.execute(`
    INSERT OR IGNORE INTO columns_tbl (id, name, position) VALUES
      ('backlog', 'Backlog', 0),
      ('today', 'Today', 1)
  `);
}
