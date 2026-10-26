import { toast, type SlotContext } from "@ynput/ayon-addon";
import { commentsLink } from "@/links";
import { throwIfRequested } from "@/testing";

// "Copy comment link" in the details panel's more menu (detailsPanel.menuItem) and the tables'
// right-click menu (entityMenuItem), see src/manifest.ts. AYON loads this when the menu opens and
// calls it on click with the slot context; one function serves both, told apart by `ctx.slot`.
const copyCommentLink = async (
  ctx: SlotContext<"detailsPanel.menuItem" | "entityMenuItem">,
) => {
  throwIfRequested("menu.copy_comment_link");
  const entity = ctx.slot === "entityMenuItem" ? ctx.entities[0] : ctx.selectedEntities[0];
  if (!entity) return;
  await navigator.clipboard.writeText(commentsLink(entity));
  toast.success(`Link to the comments on ${entity.label || entity.name || entity.entityType} copied`);
};

export default copyCommentLink;
