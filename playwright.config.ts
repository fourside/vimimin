import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "e2e",
	testMatch: "*.spec.ts",
	timeout: 30000,
	retries: 0,
	workers: 1,
	use: {
		browserName: "firefox",
	},
	webServer: {
		command: "node e2e/serve.mjs",
		port: 8932,
		reuseExistingServer: !process.env.CI,
	},
});
