import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import { qrcode } from "vite-plugin-qrcode";
import mkcert from "vite-plugin-mkcert";

const nitroConfig = process.env.VERCEL ? { preset: "vercel" } : {};

export default defineConfig({
  plugins: [solidStart(), nitro(nitroConfig), qrcode(), mkcert()],
});
