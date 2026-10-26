import { toast, type SlotContext } from "@ynput/ayon-addon";
import { commentsLink } from "@/links";
import { throwIfRequested } from "@/testing";

// "Copy comment link" in the slicer's menus (slicer.menuItem, see src/manifest.ts): a link for
// each selected folder of the hierarchy.
const copyFolderCommentLinks = async ({
  projectName,
  selected,
}: SlotContext<"slicer.menuItem">) => {
  throwIfRequested("slicer.copy_comment_link");
  const links = selected.map((row) =>
    commentsLink({ projectName, entityType: row.entityType || "folder", id: row.id }),
  );
  await navigator.clipboard.writeText(links.join("\n"));
  toast.success(
    selected.length === 1
      ? `Link to the comments on ${selected[0].label || selected[0].id} copied`
      : `Links to the comments on ${selected.length} folders copied`,
  );
};

export default copyFolderCommentLinks;
