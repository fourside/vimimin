import { expect, openFixture, test } from "./helpers/extension.js";

test.describe("search mode tests", () => {
	test.beforeEach(async ({ page }) => {
		await openFixture(page, "search-test.html");
	});

	test("/ opens search bar", async ({ page }) => {
		await page.keyboard.press("/");
		const searchBar = page.locator("#vimimin-search-bar");
		await expect(searchBar).toBeVisible();
	});

	test("search bar input is focused", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await expect(input).toBeFocused();
	});

	test("typing fox highlights 3 matches", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("fox");
		const marks = page.locator("mark");
		await expect(marks).toHaveCount(3);
	});

	test("counter shows 1/3 after search", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("fox");
		const counter = page.locator("#vimimin-search-bar span:last-child");
		await expect(counter).toHaveText("1/3");
	});

	test("Enter advances counter to 2/3", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("fox");
		await page.keyboard.press("Enter");
		const counter = page.locator("#vimimin-search-bar span:last-child");
		await expect(counter).toHaveText("2/3");
	});

	test("Shift+Enter wraps counter to 3/3", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("fox");
		// We're at 1/3, Shift+Enter goes prev → wraps to 3/3
		await page.keyboard.press("Shift+Enter");
		const counter = page.locator("#vimimin-search-bar span:last-child");
		await expect(counter).toHaveText("3/3");
	});

	test("Escape closes search bar and removes highlights", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("fox");
		await page.keyboard.press("Escape");
		const searchBar = page.locator("#vimimin-search-bar");
		await expect(searchBar).not.toBeAttached();
		const marks = page.locator("mark");
		await expect(marks).toHaveCount(0);
	});

	test("after closing search, j scrolls (normal mode)", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("fox");
		await page.keyboard.press("Escape");
		await page.keyboard.press("j");
		const scrollY = await page.evaluate(() => window.scrollY);
		expect(scrollY).toBeGreaterThan(0);
	});

	test("empty query produces no highlights", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("");
		const marks = page.locator("mark");
		await expect(marks).toHaveCount(0);
	});

	test("no-match query shows empty counter", async ({ page }) => {
		await page.keyboard.press("/");
		const input = page.locator("#vimimin-search-bar input");
		await input.fill("zzzznotfound");
		const counter = page.locator("#vimimin-search-bar span:last-child");
		await expect(counter).toHaveText("");
	});
});
