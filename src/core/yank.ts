export function formatMarkdownLink(title: string, url: string): string {
  const escaped = title.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  return `[${escaped}](${url})`;
}
