type ContentMessage =
  | { type: "get-enabled" }
  | { type: "toggle-enabled" }
  | { type: "tab-next" }
  | { type: "tab-prev" }
  | { type: "tab-close"; tabId?: number }
  | { type: "tab-restore" }
  | { type: "tab-first" }
  | { type: "tab-last" }
  | { type: "tab-list" }
  | { type: "tab-switch"; tabId: number }
  | { type: "tab-open"; url: string }
  | { type: "bookmark-list" }
  | { type: "history-list" };

const validTypes: ReadonlySet<ContentMessage["type"]> = new Set([
  "get-enabled",
  "toggle-enabled",
  "tab-next",
  "tab-prev",
  "tab-close",
  "tab-restore",
  "tab-first",
  "tab-last",
  "tab-list",
  "tab-switch",
  "tab-open",
  "bookmark-list",
  "history-list",
] as const);

export function isContentMessage(value: unknown): value is ContentMessage {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.type !== "string") return false;
  if (!(validTypes as ReadonlySet<string>).has(obj.type)) return false;
  if (obj.type === "tab-switch" && typeof obj.tabId !== "number") return false;
  if (
    obj.type === "tab-close" &&
    obj.tabId !== undefined &&
    typeof obj.tabId !== "number"
  )
    return false;
  if (obj.type === "tab-open" && typeof obj.url !== "string") return false;
  return true;
}

export type BackgroundResponse = {
  enabled: boolean;
};

export type TabInfo = {
  id: number;
  title: string;
  url: string;
  active: boolean;
};

export type TabListResponse = {
  tabs: TabInfo[];
};

export type FinderEntry = {
  title: string;
  url: string;
};

export type BookmarkListResponse = {
  bookmarks: FinderEntry[];
};

export type HistoryListResponse = {
  history: FinderEntry[];
};
