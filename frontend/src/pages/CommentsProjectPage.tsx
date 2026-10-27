import type { FC } from "react";
import {
  ProjectPageLayout,
  Slicer,
  useSlot,
  type SlotProps,
} from "@ynput/ayon-addon";
import ProjectComments from "@/App/components/ProjectComments";
import { throwIfRequested } from "@/testing";
import { useViewSort } from "./useViewSort";

// the feed reads the slicer selection, the project's folders and the view from the slot context
const SlicedComments = () => {
  const { projectName, slicer, projectFolders, views } = useSlot("project.page");
  const sort = useViewSort(views);
  return (
    <ProjectComments
      projectName={projectName}
      projectFolders={projectFolders}
      selectedFolders={slicer.selection}
      sort={sort}
    />
  );
};

// The Comments tab of the project page (project.page slot, see src/manifest.ts). AYON keeps the
// slicer's state (per page, like its own pages); the page decides where the slicer goes.
const CommentsProjectPage: FC<SlotProps<"project.page">> = () => {
  throwIfRequested("project.comments");
  return (
    <ProjectPageLayout sidebar={<Slicer fields={["hierarchy"]} />}>
      <SlicedComments />
    </ProjectPageLayout>
  );
};

export default CommentsProjectPage;
