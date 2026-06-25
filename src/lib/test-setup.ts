import client from "./db";
import { runMigration } from "./migrate";

await runMigration(client);
