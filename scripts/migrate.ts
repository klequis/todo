import { createClient } from "@libsql/client";
import { runMigration } from "../src/lib/migrate";

const url = process.env.TURSO_DATABASE_URL ?? "file:data/dev/todo.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

console.log(`Running migration against: ${url}`);
await runMigration(client);
console.log("Done.");
client.close();
