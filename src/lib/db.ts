import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL ?? `file:${process.cwd()}/data/dev/todo.db`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

client.execute("PRAGMA foreign_keys = ON").catch(() => {});

export default client;
