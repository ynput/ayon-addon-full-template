import ProjectComments from "@/App/components/ProjectComments";
import {
  AddonProjectProvider,
  RemoteAddonProjectProps,
} from "@ynput/ayon-frontend-shared/context";

// Rendered inside an AYON project page, which already provides the store, GlobalProvider,
// PowerpackProvider and the project contexts (ProjectContext, ProjectFoldersContext, Slicer,
// Views), so useProjectFoldersContext() etc. work without wrapping them again.
const CommentsProjectMain = (props: RemoteAddonProjectProps) => {
  return (
    // forwards project specific props for easy access across addon
    <AddonProjectProvider {...props}>
      <ProjectComments />
    </AddonProjectProvider>
  );
};

export default CommentsProjectMain;
