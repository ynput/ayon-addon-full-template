import type { DialogScope, SlotProps } from "@ynput/ayon-addon";
import { useProjectFoldersContext } from "@ynput/ayon-frontend-shared/context";
import ProjectComments from "@/App/components/ProjectComments";
import { throwIfRequested } from "@/testing";

// The Comments button in the project tables' toolbar (projectTable.toolbarItem, see
// src/manifest.ts). It sets `dialog`: AYON draws the button before Customize and opens its dialog
// around this content on click.
const CommentsToolbarDialog = ({
  projectName,
  page,
  list,
}: SlotProps<"projectTable.toolbarItem"> & DialogScope) => {
  throwIfRequested("toolbar.comments");
  // the toolbar's slot context has no folders; the tables sit on a project page, which has them
  const projectFolders = useProjectFoldersContext();
  return (
    <div style={{ height: 500, maxHeight: "70vh", overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }}>
      <span>{list ? `${projectName}, ${page}: ${list.label}` : `${projectName}, ${page}`}</span>
      <ProjectComments projectName={projectName} projectFolders={projectFolders} />
    </div>
  );
};

export default CommentsToolbarDialog;
