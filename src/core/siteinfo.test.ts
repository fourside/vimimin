import { describe, expect, it } from "vitest";
import { findSiteinfo } from "./siteinfo.js";

describe("findSiteinfo", () => {
  it("matches x.com", () => {
    const result = findSiteinfo("https://x.com/home");
    expect(result).toEqual({ pattern: "x.com", selector: "article" });
  });

  it("matches twitter.com", () => {
    const result = findSiteinfo("https://twitter.com/someone");
    expect(result).toEqual({ pattern: "twitter.com", selector: "article" });
  });

  it("returns undefined for unknown site", () => {
    expect(findSiteinfo("https://example.com")).toBeUndefined();
  });

  it("returns undefined for invalid URL", () => {
    expect(findSiteinfo("not-a-url")).toBeUndefined();
  });

  it("uses custom siteinfos when provided", () => {
    const custom = [{ pattern: "example.com", selector: ".item" }] as const;
    expect(findSiteinfo("https://example.com/page", custom)).toEqual({
      pattern: "example.com",
      selector: ".item",
    });
  });

  it("does not match default siteinfos when custom list is provided", () => {
    const custom = [{ pattern: "example.com", selector: ".item" }] as const;
    expect(findSiteinfo("https://x.com/home", custom)).toBeUndefined();
  });
});
