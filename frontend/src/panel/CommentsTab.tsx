import type { SlotProps } from "@ynput/ayon-addon";
import CommentsFeed from "@/App/components/CommentsFeed";
import { throwIfRequested } from "@/testing";

// The Comments tab of the details panel (detailsPanel.tab slot, see src/manifest.ts): the
// comments on the open entities. The panel opens in many places (project pages, the dashboard,
// the inbox), so everything comes from the slot context.
const CommentsTab = ({ projectName, entities }: SlotProps<"detailsPanel.tab">) => {
  throwIfRequested("panel.comments");
  if (!entities.length) return null;
  return (
    <div style={{ padding: 8, height: "100%", overflow: "hidden" }}>
      <CommentsFeed
        projectArgs={[{ projectName, folderIds: entities.map((entity) => entity.id) }]}
      />
    </div>
  );
};

export default CommentsTab;
