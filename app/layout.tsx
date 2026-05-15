import type { Metadata } from "next";
import { readFileSync } from "fs";
import path from "path";
import { applyWpContentPathsToHtml } from "@/lib/wp-public-paths";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shamsuddin Waheed - Official Author Website & Islamic Guide",
  description: "Engaging The Quran by scholar Shamsuddin Waheed. Move beyond ritual and discover the Divine text as a practical guide for modern life's challenges.",
};

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
  const headHtml = applyWpContentPathsToHtml(headRaw);

  return (
    <html lang="en-US" suppressHydrationWarning>
      <head suppressHydrationWarning dangerouslySetInnerHTML={{ __html: headHtml }} />
      <body className={BODY_CLASS} itemScope suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
