import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  type BrowserContext,
  test as base,
  expect,
  type Page,
} from "@playwright/test";
import { withExtension } from "playwright-webextext";

const extensionPath = new URL("../../dist/", import.meta.url).pathname;

export const test = base.extend<
  { page: Page },
  { extensionContext: BrowserContext }
>({
  extensionContext: [
    async ({ playwright }, use) => {
      const userDataDir = mkdtempSync(join(tmpdir(), "vimimin-e2e-"));
      const browserType = withExtension(playwright.firefox, extensionPath);
      const context = await browserType.launchPersistentContext(userDataDir, {
        headless: false,
      });
      await use(context);
      await context.close();
      rmSync(userDataDir, { recursive: true, force: true });
    },
    { scope: "worker" },
  ],
  page: async ({ extensionContext }, use) => {
    const page = await extensionContext.newPage();
    await use(page);
    await page.close();
  },
});

export { expect };

const BASE_URL = "http://localhost:8932";

export async function setUserConfig(page: Page, config: object): Promise<void> {
  await page.evaluate((c) => {
    return new Promise<void>((resolve) => {
      window.addEventListener("message", function handler(event: MessageEvent) {
        if (event.data?.type === "vimimin-e2e-storage-done") {
          window.removeEventListener("message", handler);
          resolve();
        }
      });
      window.postMessage({ type: "vimimin-e2e-set-storage", config: c }, "*");
    });
  }, config);
}

export async function openFixture(page: Page, fixture: string): Promise<void> {
  await page.goto(`${BASE_URL}/${fixture}`);
  await page.waitForSelector("html[data-vimimin-loaded]", { timeout: 5000 });
}
