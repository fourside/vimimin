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
});
