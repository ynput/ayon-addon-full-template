import { toast, type SlotContext } from "@ynput/ayon-addon";
import { fetchEntitySummaries, type EntitySummary } from "@/App/api/production";
import { formatDay } from "@/App/utils/dates";
import { throwIfRequested } from "@/testing";

/** `sh010 / comp · Compositing · In progress · ana, ben · due 3 Nov` */
const summaryLine = ({ path, kind, status, people, dueDate }: EntitySummary) =>
  [path, kind, status, people.join(", "), dueDate && `due ${formatDay(dueDate)}`]
    .filter(Boolean)
    .join(" · ");

// "Copy status summary": a line per selected entity, ready to paste into chat or an email. It
// is a pinned button in the details panel header (detailsPanel.menuItem) and an entry in the
// tables' right-click menu (entityMenuItem), and Shift+Ctrl/⌘+C in the tables (table.shortcut),
// see src/manifest.ts. AYON loads this when the menu opens (or the key is pressed) and calls it
// with the slot context; one function serves all three, told apart by `ctx.slot`.
const copyStatusSummary = async (ctx: SlotContext<"detailsPanel.menuItem" | "entityMenuItem" | "table.shortcut">) => {
  throwIfRequested("menu.copy_summary");
  const entities =
    ctx.slot === "table.shortcut"
      ? // a shortcut's rows: the summaries cover folders, tasks and versions
        ctx.rows.flatMap(({ id, entityType }) =>
          entityType && ["folder", "task", "version"].includes(entityType) ? [{ id, entityType }] : [],
        )
      : ctx.slot === "entityMenuItem"
        ? ctx.entities
        : ctx.selectedEntities;
  if (!ctx.projectName || !entities.length) return;
  const summaries = await fetchEntitySummaries(ctx.projectName, entities);
  await navigator.clipboard.writeText(summaries.map(summaryLine).join("\n"));
  toast.success(
    summaries.length === 1 ? "Status summary copied" : `Status summaries of ${summaries.length} entities copied`,
  );
};

export default copyStatusSummary;
