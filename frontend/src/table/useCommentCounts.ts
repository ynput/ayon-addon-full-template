import { useMemo } from "react";
import type { TableColumnDataHook } from "@ynput/ayon-addon";
import { useGetCommentsForProjectsQuery } from "@/App/api/getComments";

// Data of the comment count column (tableColumn, see src/manifest.ts): AYON calls it once per
// table with the rows on screen. One query for all of them, through AYON's api cache, so a new
// comment anywhere (it invalidates the activity tag) updates the counts.
const useCommentCounts: TableColumnDataHook = ({ projectName, entities }) => {
  const entityIds = useMemo(() => entities.map((entity) => entity.id), [entities]);
  const { data: comments } = useGetCommentsForProjectsQuery(
    [{ projectName, folderIds: entityIds }],
    { skip: !entityIds.length },
  );

  return useMemo(() => {
    if (!comments) return undefined;
    const counts: Record<string, number> = Object.fromEntries(entityIds.map((id) => [id, 0]));
    for (const comment of comments) {
      const id = comment.entityId as string;
      if (id in counts) counts[id] += 1;
    }
    return counts;
  }, [comments, entityIds]);
};

export default useCommentCounts;
