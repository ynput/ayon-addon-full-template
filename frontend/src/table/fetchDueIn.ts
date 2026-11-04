import { dispatch, type TableColumnFetch } from "@ynput/ayon-addon";
import { projectQueries } from "@ynput/ayon-frontend-shared/api";
import { productionApi } from "@/App/api/production";
import { daysUntil } from "@/App/utils/dates";

// Values of the Due in column (tableColumn, see src/manifest.ts): days until each task is due,
// negative when late. Done tasks and tasks without a due date have none. AYON calls this with the
// rows that come on screen, in batches, and keeps the values; it asks again for a task when it
// changes (a new due date or status). One query per batch.
const fetchDueIn: TableColumnFetch = async ({ projectName, entities, signal }) => {
  const ids = entities.filter((entity) => entity.entityType === "task").map((entity) => entity.id);
  if (!ids.length) return {};

  const summaries = dispatch(
    productionApi.endpoints.GetEntitySummaries.initiate(
      { projectName, ids, folders: false, tasks: true, versions: false },
      // AYON keeps the values and asks again only when a task changed: always the latest
      { subscribe: false, forceRefetch: true },
    ),
  );
  // AYON aborts a batch it no longer needs (another project or table)
  signal.addEventListener("abort", () => summaries.abort());
  const [data, project] = await Promise.all([
    summaries.unwrap(),
    dispatch(projectQueries.endpoints.getProject.initiate({ projectName })).unwrap(),
  ]);

  const done = new Set(
    (project.statuses ?? []).filter((status) => status.state === "done").map((status) => status.name),
  );
  const days: Record<string, number> = {};
  for (const { node } of data.project.tasks?.edges ?? []) {
    const dueDate = node.attrib?.endDate;
    if (dueDate && !done.has(node.status)) days[node.id] = daysUntil(dueDate);
  }
  return days;
};

export default fetchDueIn;
