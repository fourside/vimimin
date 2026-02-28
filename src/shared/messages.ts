export type ContentMessage =
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
