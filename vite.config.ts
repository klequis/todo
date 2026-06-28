import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import { qrcode } from "vite-plugin-qrcode";

const nitroConfig = process.env.NITRO_PRESET ? { preset: process.env.NITRO_PRESET } : {};

export default defineConfig({
  plugins: [solidStart(), nitro(nitroConfig), qrcode()],
});
