/** Public URL prefix for mirrored WordPress `wp-content` (default: Next `public/wp-content`). */
export function getWpContentBase(): string {
  const v = process.env.NEXT_PUBLIC_WP_CONTENT_BASE?.trim();
  if (!v) return "/wp-content";
  return v.replace(/\/+$/, "") || "/wp-content";
}

/** Public URL prefix for `wp-includes` (default: `public/wp-includes`). */
export function getWpIncludesBase(): string {
  const v = process.env.NEXT_PUBLIC_WP_INCLUDES_BASE?.trim();
  if (!v) return "/wp-includes";
  return v.replace(/\/+$/, "") || "/wp-includes";
}

const LEGACY_REMOTE = "https://naudummy.com/muezzin/wp-content/";

export function applyWpContentPathsToHtml(html: string): string {
  const wp = getWpContentBase();
  const inc = getWpIncludesBase();
  const defaultWp = "/wp-content";

  let out = html
    .replaceAll(LEGACY_REMOTE, `${wp}/`)
    .replaceAll('href="wp-includes/', `href="${inc}/`)
    .replaceAll("href='wp-includes/", `href='${inc}/`);

  /* Next.js: static files live under `public/` but URLs must NOT include `/public/` */
  out = out.replaceAll('src="/public/', 'src="/').replaceAll("src='/public/", "src='/");
  out = out.replaceAll('href="/public/', 'href="/').replaceAll("href='/public/", "href='/");

  if (wp !== defaultWp) {
    out = out.replaceAll(`${defaultWp}/`, `${wp}/`);
  }

  const wpSlash = `${wp}/`;
  out = out
    .replaceAll('data="wp-content/', `data="${wpSlash}`)
    .replaceAll("data='wp-content/", `data='${wpSlash}`);

  return out;
}

export function themeJsBase(): string {
  return `${getWpContentBase()}/themes/taqwa/assets/js/themejs/`;
}
