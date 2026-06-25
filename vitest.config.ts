import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      TURSO_DATABASE_URL: "file:data/test/todo.test.db",
    },
    setupFiles: ["src/lib/test-setup.ts"],
    include: ["src/**/*.test.ts"],
    exclude: ["doc/**", "node_modules/**"],
  },
});
