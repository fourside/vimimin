import { describe, expect, it } from "vitest";
import { findItemIndex } from "./ldrize.js";

describe("findItemIndex", () => {
  describe("next", () => {
    it("returns first item with top > threshold", () => {
      const rects = [{ top: -100 }, { top: 3 }, { top: 10 }, { top: 200 }];
      expect(findItemIndex(rects, 5, "next")).toBe(2);
    });

    it("returns undefined when no item exceeds threshold", () => {
      const rects = [{ top: -100 }, { top: 3 }, { top: 5 }];
      expect(findItemIndex(rects, 5, "next")).toBeUndefined();
    });

    it("returns undefined for empty array", () => {
      expect(findItemIndex([], 5, "next")).toBeUndefined();
    });

    it("excludes item at exactly threshold", () => {
      const rects = [{ top: 5 }];
      expect(findItemIndex(rects, 5, "next")).toBeUndefined();
    });
  });

  describe("prev", () => {
    it("returns last item with top < -threshold", () => {
      const rects = [{ top: -200 }, { top: -10 }, { top: 3 }, { top: 100 }];
      expect(findItemIndex(rects, 5, "prev")).toBe(1);
    });

    it("returns undefined when no item is below -threshold", () => {
      const rects = [{ top: -3 }, { top: 0 }, { top: 100 }];
      expect(findItemIndex(rects, 5, "prev")).toBeUndefined();
    });

    it("returns undefined for empty array", () => {
      expect(findItemIndex([], 5, "prev")).toBeUndefined();
    });

    it("excludes item at exactly -threshold", () => {
      const rects = [{ top: -5 }];
      expect(findItemIndex(rects, 5, "prev")).toBeUndefined();
    });
  });
});
