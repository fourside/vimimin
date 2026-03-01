import { describe, expect, it } from "vitest";
import { parseHintActionType } from "./hint-session.js";

describe("parseHintActionType", () => {
  it("parses hint-click", () => {
    expect(parseHintActionType("hint-click")).toBe("click");
  });

  it("parses hint-new-tab", () => {
    expect(parseHintActionType("hint-new-tab")).toBe("new-tab");
  });

  it("parses hint-copy-url", () => {
    expect(parseHintActionType("hint-copy-url")).toBe("copy-url");
  });

  it("parses hint-copy-text", () => {
    expect(parseHintActionType("hint-copy-text")).toBe("copy-text");
  });

  it("parses hint-copy-markdown", () => {
    expect(parseHintActionType("hint-copy-markdown")).toBe("copy-markdown");
  });

  it("returns null for non-hint action", () => {
    expect(parseHintActionType("scroll-down")).toBeNull();
  });

  it("returns null for unknown hint action", () => {
    expect(parseHintActionType("hint-unknown")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseHintActionType("")).toBeNull();
  });
});
