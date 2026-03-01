import { describe, expect, it } from "vitest";
import { filterLabels } from "./hint-filter.js";

describe("filterLabels", () => {
  const labels = ["aa", "as", "ad", "sa", "ss", "sd"];

  it("returns all labels for empty input", () => {
    const result = filterLabels("", labels);
    expect(result).toEqual({ status: "narrowed", remaining: [...labels] });
  });

  it("narrows down labels matching prefix", () => {
    const result = filterLabels("a", labels);
    expect(result).toEqual({
      status: "narrowed",
      remaining: ["aa", "as", "ad"],
    });
  });

  it("returns matched when input exactly matches a single label", () => {
    const result = filterLabels("aa", labels);
    expect(result).toEqual({ status: "matched", label: "aa" });
  });

  it("returns none when no labels match", () => {
    const result = filterLabels("x", labels);
    expect(result).toEqual({ status: "none" });
  });

  it("narrows to one candidate but not yet exact match", () => {
    const result = filterLabels("a", ["aa", "ab"]);
    expect(result).toEqual({ status: "narrowed", remaining: ["aa", "ab"] });
  });

  it("handles single-char labels with exact match", () => {
    const result = filterLabels("a", ["a", "s", "d"]);
    expect(result).toEqual({ status: "matched", label: "a" });
  });

  it("handles longer prefix with no match", () => {
    const result = filterLabels("aaa", labels);
    expect(result).toEqual({ status: "none" });
  });
});
