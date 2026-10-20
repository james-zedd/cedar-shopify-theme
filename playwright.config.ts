import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

// Playwright doesn't read .env* files itself, so load them the way Next.js does.
loadEnvConfig(process.cwd());

const baseURL = process.env.SITE_URL ?? "http://localhost:3000";

export default defineConfig({
  // Specs live outside src/ and use *.spec.ts so Vitest never picks them up.
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Run against a production build, as the Next.js testing guide recommends.
  // Locally, an already running server (e.g. `npm run dev`) is reused.
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
