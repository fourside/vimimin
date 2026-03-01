type ContentMessage =
  | { type: "get-enabled" }
  | { type: "toggle-enabled" }
  | { type: "tab-next" }
  | { type: "tab-prev" }
  | { type: "tab-close" }
  | { type: "tab-restore" }
  | { type: "tab-first" }
  | { type: "tab-last" }
  | { type: "tab-list" }
  | { type: "tab-switch"; tabId: number };

const validTypes = new Set<string>([
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
]);

export function isContentMessage(value: unknown): value is ContentMessage {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.type !== "string") return false;
  if (!validTypes.has(obj.type)) return false;
  if (obj.type === "tab-switch" && typeof obj.tabId !== "number") return false;
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
