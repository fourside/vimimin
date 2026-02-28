export type ContentMessage =
	| { type: "get-enabled" }
	| { type: "toggle-enabled" };

export type BackgroundResponse = {
	enabled: boolean;
};
