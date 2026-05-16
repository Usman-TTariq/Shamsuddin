import type { Metadata } from "next";
import { readFileSync } from "fs";
import path from "path";
import { applyWpContentPathsToHtml } from "@/lib/wp-public-paths";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site-seo";
import "./globals.css";

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function resolveMetadataBase(): URL | undefined {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    try {
      return new URL(fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`);
    } catch {
      /* ignore */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) { 
    try {
      return new URL(`https://${vercel}/`);
    } catch {
      /* ignore */
    }
  }
  return undefined;
}

const metadataBase = resolveMetadataBase();

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

/** Theme head is injected as raw HTML, so Next Metadata does not appear in the document; splice SEO tags after viewport. */
function buildDocumentHeadHtml(themeHead: string): string {
  const block = `	<title>${escapeHtmlAttr(SITE_TITLE)}</title>
	<meta name="description" content="${escapeHtmlAttr(SITE_DESCRIPTION)}" />
	<meta property="og:title" content="${escapeHtmlAttr(SITE_TITLE)}" />
	<meta property="og:description" content="${escapeHtmlAttr(SITE_DESCRIPTION)}" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="${escapeHtmlAttr(SITE_TITLE)}" />
	<meta name="twitter:description" content="${escapeHtmlAttr(SITE_DESCRIPTION)}" />`;
  const viewportRe = /(<meta\s+name=["']viewport["'][^>]*>)/i;
  if (!viewportRe.test(themeHead)) {
    return `${block}\n${themeHead}`;
  }
  return themeHead.replace(viewportRe, `$1\n${block}`);
}

const BODY_CLASS =
  "home wp-singular page-template page-template-elementor_header_footer page page-id-2330 wp-theme-taqwa elementor-default elementor-template-full-width elementor-kit-5 elementor-page elementor-page-2330";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headRaw = readFileSync(
    path.join(process.cwd(), "content/muezzin-head-fragment.html"),
    "utf8"
  );
  const headHtml = buildDocumentHeadHtml(applyWpContentPathsToHtml(headRaw));

  return (
    <html lang="en-US" suppressHydrationWarning>
      <head suppressHydrationWarning dangerouslySetInnerHTML={{ __html: headHtml }} />
      <body className={BODY_CLASS} itemScope suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
