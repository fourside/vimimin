import {
  expect,
  openFixture,
  setUserConfig,
  test,
} from "./helpers/extension.js";

test.describe("custom keymap", () => {
  test.afterEach(async ({ page }) => {
    await setUserConfig(page, {});
  });

  test("remapped key works after reload", async ({ page }) => {
    await openFixture(page, "scroll-test.html");
    await setUserConfig(page, {
      keymap: { normal: { j: "scroll-to-bottom" } },
    });
    await openFixture(page, "scroll-test.html");

    await page.keyboard.press("j");
    await page.waitForFunction(
      () =>
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 1,
    );
  });

  test("deleted key does not act after reload", async ({ page }) => {
    await openFixture(page, "scroll-test.html");
    await setUserConfig(page, {
      keymap: { normal: { j: "" } },
    });
    await openFixture(page, "scroll-test.html");

    const beforeScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("j");
    const afterScroll = await page.evaluate(() => window.scrollY);
    expect(afterScroll).toBe(beforeScroll);
  });
});
