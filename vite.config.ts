import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const baseUrl_ghpage = "/hasuki/";
const baseUrl_vercel = undefined;
const baseUrl = process.env.VERCEL ? baseUrl_vercel : baseUrl_ghpage;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: baseUrl,
});
