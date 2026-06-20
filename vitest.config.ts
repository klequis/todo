import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      VITE_DATA_ENV: "test",
      TODO_DB_PATH: "data/test/todo.test.db",
    },
    include: ["src/**/*.test.ts"],
    exclude: ["doc/**", "node_modules/**"],
  },
});
