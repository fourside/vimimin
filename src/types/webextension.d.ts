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
  namespace action {
    function setIcon(details: { path: string; tabId?: number }): Promise<void>;
    function setTitle(details: {
      title: string;
      tabId?: number;
    }): Promise<void>;
  }
  namespace tabs {
    type Tab = {
      id?: number;
      title?: string;
      url?: string;
      active?: boolean;
    };
    function query(queryInfo: Record<string, unknown>): Promise<Tab[]>;
    function update(tabId: number, props: { active: boolean }): Promise<Tab>;
    function remove(tabId: number): Promise<void>;
    namespace onRemoved {
      function addListener(callback: (tabId: number) => void): void;
    }
    namespace onActivated {
      function addListener(
        callback: (activeInfo: { tabId: number }) => void,
      ): void;
    }
  }
  namespace sessions {
    function restore(sessionId?: string): Promise<unknown>;
  }
}
