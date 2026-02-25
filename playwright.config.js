// Minimal config: the extension test launches its own persistent Chromium context.
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./tests",
  timeout: 60000,
  workers: 1,
  reporter: "list",
  use: {
    trace: "on-first-retry"
  }
};

module.exports = config;
