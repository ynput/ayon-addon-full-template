import {
  ProjectList,
  StudioPageLayout,
  toast,
  useSlot,
  type SlotProps,
} from "@ynput/ayon-addon";
import ProjectsCommentsFeed from "@/App/components/ProjectsCommentsFeed";
import { throwIfRequested } from "@/testing";

const SelectedProjectsComments = () => {
  const { selectedProjects } = useSlot("studio.page");
  return (
    <ProjectsCommentsFeed
      projectNames={selectedProjects}
      onCommentSelect={() => toast.info("A comment!")}
    />
  );
};

// The Comments tab of the dashboard (studio.page slot, see src/manifest.ts). AYON keeps the
// project selection (per page); the page places AYON's project list.
const CommentsStudioPage = (_props: SlotProps<"studio.page">) => {
  throwIfRequested("studio.comments");
  return (
    <StudioPageLayout sidebar={<ProjectList multiSelect />}>
      <SelectedProjectsComments />
    </StudioPageLayout>
  );
};

export default CommentsStudioPage;
