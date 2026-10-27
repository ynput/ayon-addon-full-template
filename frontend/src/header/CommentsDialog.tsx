import type { DialogScope, SlotProps } from "@ynput/ayon-addon";
import ProjectsComments from "@/App/components/ProjectsComments";
import { Comment } from "@/App/api/getComments";
import { throwIfRequested } from "@/testing";

// The Comments button in the header (header.item slot, see src/manifest.ts). It sets `dialog`:
// AYON draws the button and opens its own dialog around this content on click (title and size
// from the manifest); `close` closes it.
const CommentsDialog = ({ close, navigate }: SlotProps<"header.item"> & DialogScope) => {
  throwIfRequested("header.comments");

  const handleNavigateToComment = (comment: Comment) => {
    close();
    const searchParams = new URLSearchParams({
      project: comment.projectName,
      type: "folder",
      id: comment.entityId as string,
      activity: comment.activityId,
    });
    navigate(`/projects/${comment.projectName}/overview?${searchParams.toString()}`);
  };

  return (
    <div
      style={{
        height: "600px",
        maxHeight: "80vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <ProjectsComments onCommentSelect={handleNavigateToComment} />
    </div>
  );
};

export default CommentsDialog;
