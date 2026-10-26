import { toast, type SlotContext } from "@ynput/ayon-addon";
import { commentsLink } from "@/links";
import { throwIfRequested } from "@/testing";

// "Copy comment link" (detailsPanel.menuItem, see src/manifest.ts). AYON loads this when the
// menu opens and calls it on click with the slot context.
const copyCommentLink = async (ctx: SlotContext<"detailsPanel.menuItem">) => {
  throwIfRequested("menu.copy_comment_link");
  const entity = ctx.selectedEntities[0];
  if (!entity) return;
  await navigator.clipboard.writeText(commentsLink(entity));
  toast.success(`Link to the comments on ${entity.label || entity.name || entity.entityType} copied`);
};

export default copyCommentLink;
