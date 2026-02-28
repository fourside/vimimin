declare namespace browser {
	namespace runtime {
		function sendMessage(message: unknown): Promise<unknown>;
		namespace onMessage {
			function addListener(
				callback: (
					message: unknown,
					sender: { tab?: { id?: number; url?: string } },
				) => Promise<unknown> | undefined,
			): void;
		}
	}
	namespace storage {
		namespace session {
			function get(keys: string | string[]): Promise<Record<string, unknown>>;
			function set(items: Record<string, unknown>): Promise<void>;
			function remove(keys: string | string[]): Promise<void>;
		}
		namespace local {
			function get(keys: string | string[]): Promise<Record<string, unknown>>;
		}
	}
	namespace tabs {
		namespace onRemoved {
			function addListener(callback: (tabId: number) => void): void;
		}
	}
}
