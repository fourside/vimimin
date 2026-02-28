import { isBlacklisted } from "../core/blacklist.js";
import type { BackgroundResponse, ContentMessage } from "../shared/messages.js";

function storageKey(tabId: number): string {
	return `tab:${tabId}:enabled`;
}

async function getEnabled(
	tabId: number,
	url: string,
): Promise<BackgroundResponse> {
	const key = storageKey(tabId);
	const result = await browser.storage.session.get(key);
	if (key in result) {
		return { enabled: result[key] as boolean };
	}
	const data = await browser.storage.local.get("blacklist");
	const patterns = (data.blacklist as string[] | undefined) ?? [];
	return { enabled: !isBlacklisted(url, patterns) };
}

async function toggleEnabled(
	tabId: number,
	url: string,
): Promise<BackgroundResponse> {
	const current = await getEnabled(tabId, url);
	const next = !current.enabled;
	await browser.storage.session.set({ [storageKey(tabId)]: next });
	return { enabled: next };
}

browser.runtime.onMessage.addListener((message, sender) => {
	const msg = message as ContentMessage;
	const tabId = sender.tab?.id;
	const url = sender.tab?.url ?? "";
	if (tabId === undefined) return;

	switch (msg.type) {
		case "get-enabled":
			return getEnabled(tabId, url);
		case "toggle-enabled":
			return toggleEnabled(tabId, url);
	}
});

browser.tabs.onRemoved.addListener((tabId) => {
	browser.storage.session.remove(storageKey(tabId));
});
