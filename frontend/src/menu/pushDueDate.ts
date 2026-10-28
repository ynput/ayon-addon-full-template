import { dispatch, toast, type SlotContext } from "@ynput/ayon-addon";
import { entitiesQueries } from "@ynput/ayon-frontend-shared/api";
import { fetchEntitySummaries } from "@/App/api/production";
import { addDays } from "@/App/utils/dates";
import { throwIfRequested } from "@/testing";

// "Push due date by a day" in the tables' right-click menu, for the selected tasks
// (entityMenuItem, see src/manifest.ts). It writes through AYON's own update, the one the details
// panel uses: the tables and the panel update at once, the change is undone if the server
// refuses it, and every query that provides the tasks' tags (the Due in column) refetches.
const pushDueDate = async ({ projectName, entities }: SlotContext<"entityMenuItem">) => {
  throwIfRequested("menu.push_due_date");
  const tasks = (await fetchEntitySummaries(projectName, entities)).filter((task) => task.dueDate);
  if (!tasks.length) {
    toast.info("None of the selected tasks has a due date");
    return;
  }
  await dispatch(
    entitiesQueries.endpoints.updateEntities.initiate({
      entityType: "task",
      operations: tasks.map((task) => ({
        id: task.id,
        projectName,
        entityType: "task",
        data: { attrib: { endDate: addDays(task.dueDate!, 1) } },
      })),
    }),
  ).unwrap();
  const skipped = entities.length - tasks.length;
  toast.success(
    `Due date pushed for ${tasks.length} task${tasks.length === 1 ? "" : "s"}` +
      (skipped ? ` (${skipped} without a due date left as they are)` : ""),
  );
};

export default pushDueDate;
