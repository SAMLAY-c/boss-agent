const path = require("path");
const { test, expect, chromium } = require("@playwright/test");

test("loads unpacked extension and opens popup", async ({}, testInfo) => {
  const extensionPath = path.resolve(__dirname, "..");
  const userDataDir = testInfo.outputPath("user-data");

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: "chromium",
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });

  try {
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent("serviceworker", { timeout: 15000 });
    }

    const serviceWorkerUrl = serviceWorker.url();
    expect(serviceWorkerUrl.startsWith("chrome-extension://")).toBeTruthy();

    const extensionId = new URL(serviceWorkerUrl).host;
    expect(extensionId).toBeTruthy();

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`, {
      waitUntil: "domcontentloaded"
    });

    await expect(popup.locator(".main-container")).toBeVisible();
    await expect(popup.locator(".header")).toBeVisible();
    await expect(popup.locator("#resume")).toHaveCount(1);
    await expect(popup.locator("#saveBtn")).toHaveCount(1);
  } finally {
    await context.close();
  }
});
