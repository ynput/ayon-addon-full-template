import { useMemo } from "react";
import type { PageViews } from "@ynput/ayon-addon";
import type { CommentsSort } from "@/App/components/CommentsFeed";
import type { CommentsSortOrder } from "@/App/client/productionSlice";

// The pages keep the feed's sort order in their view (`viewType` in src/manifest.ts): AYON shows
// the views menu, so a user can save "oldest first" as a view and share it. The settings' shape
// is the addon's own: here `{ sortOrder }`.
export const useViewSort = (views: PageViews | undefined): CommentsSort | undefined => {
  const saved = views?.settings?.sortOrder;
  return useMemo(() => {
    if (!views) return undefined;
    return {
      sortOrder: saved === "oldest" ? "oldest" : "newest",
      onChange: (sortOrder: CommentsSortOrder) => {
        // saving before the view has loaded would write over its settings
        if (!views.isLoading) views.updateSettings({ sortOrder });
      },
    };
  }, [views, saved]);
};
