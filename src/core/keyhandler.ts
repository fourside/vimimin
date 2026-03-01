import type { Mode } from "../shared/types.js";
import type { Keymap } from "./keymap.js";

export type Timer = {
  set(fn: () => void, ms: number): number;
  clear(id: number): void;
};

const defaultTimer: Timer = {
  set: (fn, ms) => setTimeout(fn, ms) as unknown as number,
  clear: (id) => clearTimeout(id),
};

export class KeyHandler {
  private buffer: string[] = [];
  private timerId: number | null = null;
  private readonly sequenceTimeout: number;

  constructor(
    private readonly keymap: Keymap,
    private readonly timer: Timer = defaultTimer,
    sequenceTimeout = 300,
  ) {
    this.sequenceTimeout = sequenceTimeout;
  }

  /**
   * Feed a key event and return the resolved action name, or null if
   * the key is buffered (waiting for more input) or unmatched.
   */
  feed(key: string, mode: Mode): string | null {
    this.clearTimer();

    const bindings = this.keymap[mode];
    this.buffer.push(key);
    const seq = this.buffer.join(" ");

    // Exact match
    if (seq in bindings) {
      // Check if there's a longer sequence that starts with this
      const hasLonger = Object.keys(bindings).some(
        (k) => k.startsWith(`${seq} `) && k !== seq,
      );
      if (hasLonger) {
        // Wait for possible longer match
        this.startTimer(mode);
        return null;
      }
      const action = bindings[seq];
      this.buffer = [];
      return action ?? null;
    }

    // Partial prefix match — buffer and wait
    const isPrefix = Object.keys(bindings).some((k) => k.startsWith(`${seq} `));
    if (isPrefix) {
      this.startTimer(mode);
      return null;
    }

    // No match at all — reset buffer
    this.buffer = [];
    return null;
  }

  /** Force-resolve the current buffer (called on timeout). */
  resolve(mode: Mode): string | null {
    const seq = this.buffer.join(" ");
    const bindings = this.keymap[mode];
    this.buffer = [];

    if (seq in bindings) {
      return bindings[seq] ?? null;
    }
    return null;
  }

  reset(): void {
    this.clearTimer();
    this.buffer = [];
  }

  private startTimer(mode: Mode): void {
    this.timerId = this.timer.set(() => {
      const action = this.resolve(mode);
      if (action) {
        this.onTimeout?.(action);
      }
    }, this.sequenceTimeout);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      this.timer.clear(this.timerId);
      this.timerId = null;
    }
  }

  /** Callback invoked when a timeout resolves a buffered sequence to an action. */
  onTimeout: ((action: string) => void) | null = null;
}
