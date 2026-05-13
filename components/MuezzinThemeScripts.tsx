"use client";

import Script from "next/script";
import { themeJsBase } from "@/lib/wp-public-paths";

export function MuezzinThemeScripts() {
  const base = themeJsBase();
  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        strategy="afterInteractive"
      />
      <Script
        src={`${base}perfect-scrollbar.min8a54.js`}
        strategy="afterInteractive"
      />
      <Script
        src={`${base}custom-scripts8a54.js`}
        strategy="lazyOnload"
      />
    </>
  );
}
