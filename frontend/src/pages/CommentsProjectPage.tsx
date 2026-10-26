import type { SlotProps } from "@ynput/ayon-addon";
import ProjectComments from "@/App/components/ProjectComments";
import { throwIfRequested } from "@/testing";

// The Comments tab of the project page (project.page slot, see src/manifest.ts).
// AYON renders it inside the project providers (project, folders, slicer, views).
const CommentsProjectPage = ({ projectName }: SlotProps<"project.page">) => {
  throwIfRequested("project.comments");
  return <ProjectComments projectName={projectName} />;
};

export default CommentsProjectPage;
