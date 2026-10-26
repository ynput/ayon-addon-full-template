import { Dialog } from "@ynput/ayon-react-components";
import { useNavigate, type SlotProps } from "@ynput/ayon-addon";
import ProjectsComments from "@/App/components/ProjectsComments";
import { Comment } from "@/App/api/getComments";
import { throwIfRequested } from "@/testing";

// The Comments button in the header (header.item slot, see src/manifest.ts). AYON draws the
// button and renders this on the first click, with `open` and `onClose`.
const CommentsDialog = ({ open, onClose }: SlotProps<"header.item">) => {
  throwIfRequested("header.comments");
  const navigate = useNavigate();

  const handleNavigateToComment = (comment: Comment) => {
    onClose();
    const searchParams = new URLSearchParams({
      project: comment.projectName,
      type: "folder",
      id: comment.entityId as string,
      activity: comment.activityId,
    });
    navigate(`/projects/${comment.projectName}/overview?${searchParams.toString()}`);
  };

  return (
    <Dialog isOpen={open} onClose={onClose} header="Project Comments" size="lg">
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
    </Dialog>
  );
};

export default CommentsDialog;
