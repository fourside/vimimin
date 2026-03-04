import { describe, expect, it } from "vitest";
import { mergeKeymap, mergeSiteinfos, validateConfig } from "./config.js";
import type { Keymap } from "./keymap.js";
import type { Siteinfo } from "./siteinfo.js";

const baseKeymap: Keymap = {
  normal: { j: "scroll-down", k: "scroll-up", "g t": "tab-next" },
  insert: {},
  hint: {},
  search: {},
};

describe("mergeKeymap", () => {
  it("returns base when overrides is undefined", () => {
    expect(mergeKeymap(baseKeymap, undefined)).toEqual(baseKeymap);
  });

  it("overrides existing binding", () => {
    const result = mergeKeymap(baseKeymap, { normal: { j: "custom-action" } });
    expect(result.normal.j).toBe("custom-action");
    expect(result.normal.k).toBe("scroll-up");
  });

  it("adds new binding", () => {
    const result = mergeKeymap(baseKeymap, { normal: { x: "new-action" } });
    expect(result.normal.x).toBe("new-action");
    expect(result.normal.j).toBe("scroll-down");
  });

  it("removes binding with empty string", () => {
    const result = mergeKeymap(baseKeymap, { normal: { "g t": "" } });
    expect(result.normal["g t"]).toBeUndefined();
    expect("g t" in result.normal).toBe(false);
  });

  it("does not mutate base keymap", () => {
    mergeKeymap(baseKeymap, { normal: { j: "changed" } });
    expect(baseKeymap.normal.j).toBe("scroll-down");
  });
});

describe("mergeSiteinfos", () => {
  const builtins: readonly Siteinfo[] = [
    { pattern: "x.com", selector: "article" },
    { pattern: "twitter.com", selector: "article" },
  ];

  it("returns builtins when user is undefined", () => {
    expect(mergeSiteinfos(builtins, undefined)).toEqual(builtins);
  });

  it("returns builtins when user is empty", () => {
    expect(mergeSiteinfos(builtins, [])).toEqual(builtins);
  });

  it("adds user siteinfo", () => {
    const user: Siteinfo[] = [{ pattern: "example.com", selector: ".item" }];
    const result = mergeSiteinfos(builtins, user);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      pattern: "example.com",
      selector: ".item",
    });
  });

  it("user overrides builtin with same pattern", () => {
    const user: Siteinfo[] = [{ pattern: "x.com", selector: ".custom" }];
    const result = mergeSiteinfos(builtins, user);
    expect(result).toHaveLength(2);
    expect(result.find((s) => s.pattern === "x.com")?.selector).toBe(".custom");
  });
});

describe("validateConfig", () => {
  it("accepts empty object", () => {
    expect(validateConfig({})).toEqual({});
  });

  it("accepts valid keymap", () => {
    const config = validateConfig({
      keymap: { normal: { j: "scroll-down" } },
    });
    expect(config.keymap).toEqual({ normal: { j: "scroll-down" } });
  });

  it("accepts valid siteinfo", () => {
    const config = validateConfig({
      siteinfo: [{ pattern: "x.com", selector: "article" }],
    });
    expect(config.siteinfo).toEqual([
      { pattern: "x.com", selector: "article" },
    ]);
  });

  it("throws for non-object", () => {
    expect(() => validateConfig("string")).toThrow(
      "Config must be a JSON object",
    );
    expect(() => validateConfig(null)).toThrow("Config must be a JSON object");
    expect(() => validateConfig([])).toThrow("Config must be a JSON object");
  });

  it("throws for invalid mode", () => {
    expect(() => validateConfig({ keymap: { bad: {} } })).toThrow(
      "Invalid mode",
    );
  });

  it("throws for non-string keymap value", () => {
    expect(() => validateConfig({ keymap: { normal: { j: 123 } } })).toThrow(
      "keymap values must be strings",
    );
  });

  it("throws for non-array siteinfo", () => {
    expect(() => validateConfig({ siteinfo: "bad" })).toThrow(
      "siteinfo must be an array",
    );
  });

  it("throws for siteinfo entry missing fields", () => {
    expect(() => validateConfig({ siteinfo: [{ pattern: "x" }] })).toThrow(
      "must have pattern and selector strings",
    );
  });
});
