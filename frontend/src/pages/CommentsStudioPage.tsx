import type { FC } from "react";
import {
  ProjectList,
  StudioPageLayout,
  toast,
  useSlot,
  type SlotProps,
} from "@ynput/ayon-addon";
import ProjectsCommentsFeed from "@/App/components/ProjectsCommentsFeed";
import { throwIfRequested } from "@/testing";
import { useViewSort } from "./useViewSort";

const SelectedProjectsComments = () => {
  const { selectedProjects, views } = useSlot("studio.page");
  const sort = useViewSort(views);
  return (
    <ProjectsCommentsFeed
      projectNames={selectedProjects}
      onCommentSelect={() => toast.info("A comment!")}
      sort={sort}
    />
  );
};

// The Comments tab of the dashboard (studio.page slot, see src/manifest.ts). AYON keeps the
// project selection (per page); the page places AYON's project list.
const CommentsStudioPage: FC<SlotProps<"studio.page">> = () => {
  throwIfRequested("studio.comments");
  return (
    <StudioPageLayout sidebar={<ProjectList multiSelect />}>
      <SelectedProjectsComments />
    </StudioPageLayout>
  );
};

export default CommentsStudioPage;
