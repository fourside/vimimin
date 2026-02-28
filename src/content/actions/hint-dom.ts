const CLICKABLE_SELECTOR = [
	"a[href]",
	"button",
	"input:not([type='hidden'])",
	"select",
	"textarea",
	"[role='button']",
	"[role='link']",
	"[role='tab']",
	"[role='checkbox']",
	"[role='menuitem']",
	"[onclick]",
	"[tabindex]",
	"summary",
].join(",");

function isVisible(el: Element): boolean {
	const style = getComputedStyle(el);
	if (style.display === "none") return false;
	if (style.visibility === "hidden") return false;
	if (Number.parseFloat(style.opacity) === 0) return false;

	const rect = el.getBoundingClientRect();
	if (rect.width === 0 && rect.height === 0) return false;

	const inViewport =
		rect.bottom > 0 &&
		rect.top < window.innerHeight &&
		rect.right > 0 &&
		rect.left < window.innerWidth;

	return inViewport;
}

export function collectHintTargets(): Element[] {
	const all = document.querySelectorAll(CLICKABLE_SELECTOR);
	const visible: Element[] = [];
	for (const el of all) {
		if (isVisible(el)) {
			visible.push(el);
		}
	}
	return visible;
}
