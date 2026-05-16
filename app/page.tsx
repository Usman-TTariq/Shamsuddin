import { readFileSync } from "fs";
import path from "path";
import { EngageLeadModal } from "@/components/EngageLeadModal";
import { MuezzinClientInit } from "@/components/MuezzinClientInit";
import { MuezzinThemeScripts } from "@/components/MuezzinThemeScripts";
import { applyWpContentPathsToHtml } from "@/lib/wp-public-paths";

export const dynamic = "force-dynamic";

export default function Home() {
  const mainRaw = readFileSync(
    path.join(process.cwd(), "content/muezzin-main-fragment.html"),
    "utf8"
  );
  const mainHtml = applyWpContentPathsToHtml(mainRaw);

  return (
    <>
      <main suppressHydrationWarning dangerouslySetInnerHTML={{ __html: mainHtml }} />
      <EngageLeadModal />
      <MuezzinClientInit />
      <MuezzinThemeScripts />
    </>
  );
}
