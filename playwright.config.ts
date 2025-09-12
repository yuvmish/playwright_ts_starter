import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: "https://demo.playwright.dev",
    trace: "on-first-retry",
  },
  reporter: [["html", { open: "never" }]],
  retries: 1,
});
