import { useMemo } from "react";
import type { TableColumnDataHook } from "@ynput/ayon-addon";
import { useGetProjectQuery } from "@ynput/ayon-frontend-shared/api";
import { useGetEntitySummariesQuery } from "@/App/api/production";
import { daysUntil } from "@/App/utils/dates";

// Data of the Due in column (tableColumn, see src/manifest.ts): AYON calls it once per table
// with the rows on screen, and each cell gets its entity's value: days until the task is due,
// negative when late. Done tasks and tasks without a due date have none. One query for all rows,
// through AYON's api cache, refetched when a task changes (src/App/api/production.ts).
const useDueIn: TableColumnDataHook = ({ projectName, entities }) => {
  const ids = useMemo(
    () => entities.filter((entity) => entity.entityType === "task").map((entity) => entity.id),
    [entities],
  );
  const { data } = useGetEntitySummariesQuery(
    { projectName, ids, folders: false, tasks: true, versions: false },
    { skip: !ids.length },
  );
  const { data: project } = useGetProjectQuery({ projectName });

  return useMemo(() => {
    if (!data || !project) return undefined;
    const done = new Set(
      (project.statuses ?? []).filter((status) => status.state === "done").map((status) => status.name),
    );
    const days: Record<string, number> = {};
    for (const { node } of data.project.tasks?.edges ?? []) {
      const dueDate = node.attrib?.endDate;
      if (dueDate && !done.has(node.status)) days[node.id] = daysUntil(dueDate);
    }
    return days;
  }, [data, project]);
};

export default useDueIn;
