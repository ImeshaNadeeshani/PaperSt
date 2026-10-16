import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 180000,
  expect: { timeout: 8000 },
  use: { baseURL: "http://127.0.0.1:5173", headless: true },
  reporter: "list",
  workers: 1,
});
