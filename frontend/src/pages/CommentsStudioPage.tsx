import type { SlotProps } from "@ynput/ayon-addon";
import ProjectsComments from "@/App/components/ProjectsComments";
import { throwIfRequested } from "@/testing";

// The Comments tab of the dashboard (studio.page slot, see src/manifest.ts).
const CommentsStudioPage = (_props: SlotProps<"studio.page">) => {
  throwIfRequested("studio.comments");
  return <ProjectsComments />;
};

export default CommentsStudioPage;
