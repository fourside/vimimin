import { isBlacklisted } from "../core/blacklist.js";
import type {
  BackgroundResponse,
  BookmarkListResponse,
  HistoryListResponse,
  TabListResponse,
} from "../shared/messages.js";
import { isContentMessage } from "../shared/messages.js";

async function updateIcon(tabId: number, enabled: boolean): Promise<void> {
  const path = enabled ? "icons/enabled.svg" : "icons/disabled.svg";
  const title = enabled ? "vimimin (enabled)" : "vimimin (disabled)";
  await browser.action.setIcon({ path, tabId });
  await browser.action.setTitle({ title, tabId });
}

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

async function tabNext(): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const current = tabs.findIndex((t) => t.active);
  const next = tabs[(current + 1) % tabs.length];
  if (next?.id !== undefined) {
    await browser.tabs.update(next.id, { active: true });
  }
}

async function tabPrev(): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const current = tabs.findIndex((t) => t.active);
  const prev = tabs[(current - 1 + tabs.length) % tabs.length];
  if (prev?.id !== undefined) {
    await browser.tabs.update(prev.id, { active: true });
  }
}

async function tabClose(tabId: number): Promise<void> {
  await browser.tabs.remove(tabId);
}

async function tabRestore(): Promise<void> {
  await browser.sessions.restore();
}

async function tabFirst(): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const first = tabs[0];
  if (first?.id !== undefined) {
    await browser.tabs.update(first.id, { active: true });
  }
}

async function tabLast(): Promise<void> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const last = tabs[tabs.length - 1];
  if (last?.id !== undefined) {
    await browser.tabs.update(last.id, { active: true });
  }
}

async function tabList(): Promise<TabListResponse> {
  const tabs = await browser.tabs.query({ currentWindow: true });
  return {
    tabs: tabs
      .filter((t) => t.id !== undefined)
      .map((t) => ({
        id: t.id as number,
        title: t.title ?? "",
        url: t.url ?? "",
        active: t.active ?? false,
      })),
  };
}

async function tabSwitch(tabId: number): Promise<void> {
  await browser.tabs.update(tabId, { active: true });
}

async function tabOpen(url: string): Promise<void> {
  await browser.tabs.create({ url, active: false });
}

async function bookmarkList(): Promise<BookmarkListResponse> {
  const nodes = await browser.bookmarks.search({});
  return {
    bookmarks: nodes
      .filter((n) => n.url)
      .map((n) => ({ title: n.title, url: n.url as string })),
  };
}

async function historyList(): Promise<HistoryListResponse> {
  const items = await browser.history.search({
    text: "",
    maxResults: 1000,
    startTime: 0,
  });
  return {
    history: items
      .filter((h) => h.url)
      .map((h) => ({ title: h.title ?? "", url: h.url as string })),
  };
}

browser.runtime.onMessage.addListener((message, sender) => {
  if (!isContentMessage(message)) return;
  const tabId = sender.tab?.id;
  const url = sender.tab?.url ?? "";

  switch (message.type) {
    case "get-enabled":
      if (tabId === undefined) return;
      return getEnabled(tabId, url).then(async (res) => {
        await updateIcon(tabId, res.enabled);
        return res;
      });
    case "toggle-enabled":
      if (tabId === undefined) return;
      return toggleEnabled(tabId, url).then(async (res) => {
        await updateIcon(tabId, res.enabled);
        return res;
      });
    case "tab-next":
      return tabNext() as Promise<unknown>;
    case "tab-prev":
      return tabPrev() as Promise<unknown>;
    case "tab-close":
      if (tabId === undefined) return;
      return tabClose(tabId) as Promise<unknown>;
    case "tab-restore":
      return tabRestore() as Promise<unknown>;
    case "tab-first":
      return tabFirst() as Promise<unknown>;
    case "tab-last":
      return tabLast() as Promise<unknown>;
    case "tab-list":
      return tabList();
    case "tab-switch":
      return tabSwitch(message.tabId) as Promise<unknown>;
    case "tab-open":
      return tabOpen(message.url) as Promise<unknown>;
    case "bookmark-list":
      return bookmarkList();
    case "history-list":
      return historyList();
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  browser.storage.session.remove(storageKey(tabId));
});

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  const key = storageKey(tabId);
  const result = await browser.storage.session.get(key);
  const enabled = key in result ? (result[key] as boolean) : true;
  await updateIcon(tabId, enabled);
});
