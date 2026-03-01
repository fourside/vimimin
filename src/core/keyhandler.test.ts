import { beforeEach, describe, expect, it, vi } from "vitest";
import { KeyHandler, type Timer } from "./keyhandler.js";
import type { Keymap } from "./keymap.js";

function createFakeTimer() {
  const timers = new Map<number, { fn: () => void; ms: number }>();
  let nextId = 1;
  const timer: Timer = {
    set(fn, ms) {
      const id = nextId++;
      timers.set(id, { fn, ms });
      return id;
    },
    clear(id) {
      timers.delete(id);
    },
  };
  return {
    timer,
    fire(id: number) {
      const entry = timers.get(id);
      if (entry) {
        timers.delete(id);
        entry.fn();
      }
    },
    fireAll() {
      for (const [id, entry] of timers) {
        timers.delete(id);
        entry.fn();
      }
    },
    get pending() {
      return timers.size;
    },
  };
}

const testKeymap: Keymap = {
  normal: {
    j: "scroll-down",
    k: "scroll-up",
    "g g": "scroll-to-top",
    G: "scroll-to-bottom",
    "<C-d>": "scroll-half-page-down",
  },
  insert: {},
  hint: {},
  search: {},
};

describe("KeyHandler", () => {
  let fakeTimer: ReturnType<typeof createFakeTimer>;
  let handler: KeyHandler;

  beforeEach(() => {
    fakeTimer = createFakeTimer();
    handler = new KeyHandler(testKeymap, fakeTimer.timer);
  });

  it("resolves single-key binding immediately", () => {
    expect(handler.feed("j", "normal")).toBe("scroll-down");
  });

  it("resolves modifier key binding immediately", () => {
    expect(handler.feed("<C-d>", "normal")).toBe("scroll-half-page-down");
  });

  it("returns null for unbound key", () => {
    expect(handler.feed("x", "normal")).toBeNull();
  });

  it("returns null in insert mode for normal-mode key", () => {
    expect(handler.feed("j", "insert")).toBeNull();
  });

  describe("key sequences", () => {
    it("buffers first key of a sequence and returns null", () => {
      expect(handler.feed("g", "normal")).toBeNull();
      expect(fakeTimer.pending).toBe(1);
    });

    it("resolves two-key sequence on second key", () => {
      handler.feed("g", "normal");
      expect(handler.feed("g", "normal")).toBe("scroll-to-top");
    });

    it("returns null when sequence prefix does not complete to a match", () => {
      handler.feed("g", "normal");
      expect(handler.feed("x", "normal")).toBeNull();
    });

    it("resolves via timeout callback when sequence is a valid prefix that times out", () => {
      const timeoutSpy = vi.fn();
      handler.onTimeout = timeoutSpy;

      handler.feed("g", "normal");
      fakeTimer.fireAll();

      // g alone is not a valid binding, so timeout should not fire action
      expect(timeoutSpy).not.toHaveBeenCalled();
    });

    it("resets buffer on reset()", () => {
      handler.feed("g", "normal");
      handler.reset();
      // After reset, g should start fresh
      expect(handler.feed("g", "normal")).toBeNull();
      expect(handler.feed("g", "normal")).toBe("scroll-to-top");
    });
  });

  describe("single key that is also a sequence prefix", () => {
    const keymapWithOverlap: Keymap = {
      normal: {
        g: "single-g",
        "g g": "double-g",
      },
      insert: {},
      hint: {},
      search: {},
    };

    it("waits for possible longer sequence", () => {
      const h = new KeyHandler(keymapWithOverlap, fakeTimer.timer);
      expect(h.feed("g", "normal")).toBeNull();
    });

    it("resolves to longer sequence when completed", () => {
      const h = new KeyHandler(keymapWithOverlap, fakeTimer.timer);
      h.feed("g", "normal");
      expect(h.feed("g", "normal")).toBe("double-g");
    });

    it("resolves to single-key binding on timeout", () => {
      const timeoutSpy = vi.fn();
      const h = new KeyHandler(keymapWithOverlap, fakeTimer.timer);
      h.onTimeout = timeoutSpy;

      h.feed("g", "normal");
      fakeTimer.fireAll();

      expect(timeoutSpy).toHaveBeenCalledWith("single-g");
    });
  });
});
