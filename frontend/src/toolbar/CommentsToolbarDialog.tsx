import { Dialog } from "@ynput/ayon-react-components";
import type { SlotProps } from "@ynput/ayon-addon";
import { useProjectFoldersContext } from "@ynput/ayon-frontend-shared/context";
import ProjectComments from "@/App/components/ProjectComments";
import { throwIfRequested } from "@/testing";

// The Comments button in the project tables' toolbar (projectTable.toolbarItem, see
// src/manifest.ts): AYON draws the button before Customize and renders this on the first click.
const CommentsToolbarDialog = ({
  projectName,
  page,
  list,
  open,
  onClose,
}: SlotProps<"projectTable.toolbarItem">) => {
  throwIfRequested("toolbar.comments");
  // the toolbar's slot context has no folders; the tables sit on a project page, which has them
  const projectFolders = useProjectFoldersContext();
  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      header={`Comments in ${projectName}${list ? ` (${page}: ${list.label})` : ` (${page})`}`}
      size="lg"
    >
      <div style={{ height: 500, maxHeight: "70vh", overflow: "hidden", display: "flex" }}>
        {open && <ProjectComments projectName={projectName} projectFolders={projectFolders} />}
      </div>
    </Dialog>
  );
};

export default CommentsToolbarDialog;
