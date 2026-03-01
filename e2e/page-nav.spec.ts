import { expect, openFixture, test } from "./helpers/extension.js";

test.describe("page navigation with [[ and ]]", () => {
  test("]] navigates to next page via link[rel=next]", async ({ page }) => {
    await openFixture(page, "page-nav-test.html");
    await page.keyboard.press("]");
    await page.keyboard.press("]");
    await page.waitForURL("**/page-nav-next.html");
    expect(page.url()).toContain("/page-nav-next.html");
  });

  test("[[ navigates to prev page via link[rel=prev]", async ({ page }) => {
    await openFixture(page, "page-nav-test.html");
    await page.keyboard.press("[");
    await page.keyboard.press("[");
    await page.waitForURL("**/page-nav-prev.html");
    expect(page.url()).toContain("/page-nav-prev.html");
  });

  test("]] navigates via a[rel=next]", async ({ page }) => {
    await openFixture(page, "page-nav-rel-test.html");
    await page.keyboard.press("]");
    await page.keyboard.press("]");
    await page.waitForURL("**/rel-next.html");
    expect(page.url()).toContain("/rel-next.html");
  });

  test("[[ navigates via a[rel=prev]", async ({ page }) => {
    await openFixture(page, "page-nav-rel-test.html");
    await page.keyboard.press("[");
    await page.keyboard.press("[");
    await page.waitForURL("**/rel-prev.html");
    expect(page.url()).toContain("/rel-prev.html");
  });

  test("]] navigates via anchor text matching 'Next'", async ({ page }) => {
    await openFixture(page, "page-nav-text-test.html");
    await page.keyboard.press("]");
    await page.keyboard.press("]");
    await page.waitForURL("**/text-next.html");
    expect(page.url()).toContain("/text-next.html");
  });

  test("[[ navigates via anchor text matching 'Prev'", async ({ page }) => {
    await openFixture(page, "page-nav-text-test.html");
    await page.keyboard.press("[");
    await page.keyboard.press("[");
    await page.waitForURL("**/text-prev.html");
    expect(page.url()).toContain("/text-prev.html");
  });
});
