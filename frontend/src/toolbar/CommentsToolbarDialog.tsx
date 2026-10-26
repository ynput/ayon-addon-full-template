import { Dialog } from "@ynput/ayon-react-components";
import type { SlotProps } from "@ynput/ayon-addon";
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
  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      header={`Comments in ${projectName}${list ? ` (${page}: ${list.label})` : ` (${page})`}`}
      size="lg"
    >
      <div style={{ height: 500, maxHeight: "70vh", overflow: "hidden", display: "flex" }}>
        {open && <ProjectComments projectName={projectName} />}
      </div>
    </Dialog>
  );
};

export default CommentsToolbarDialog;
