type Siteinfo = {
  readonly pattern: string;
  readonly selector: string;
};

const siteinfos: readonly Siteinfo[] = [
  { pattern: "x.com", selector: "article" },
  { pattern: "twitter.com", selector: "article" },
];

export function findSiteinfo(url: string): Siteinfo | undefined {
  try {
    const hostname = new URL(url).hostname;
    return siteinfos.find((s) => s.pattern === hostname);
  } catch {
    return undefined;
  }
}
