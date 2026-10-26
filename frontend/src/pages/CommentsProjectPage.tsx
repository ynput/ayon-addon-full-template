import {
  ProjectPageLayout,
  Slicer,
  useSlot,
  type SlotProps,
} from "@ynput/ayon-addon";
import ProjectComments from "@/App/components/ProjectComments";
import { throwIfRequested } from "@/testing";

// the feed reads the slicer selection from the slot context
const SlicedComments = () => {
  const { projectName, slicer } = useSlot("project.page");
  return (
    <ProjectComments projectName={projectName} selectedFolders={slicer.selection} />
  );
};

// The Comments tab of the project page (project.page slot, see src/manifest.ts). AYON keeps the
// slicer's state (per page, like its own pages); the page decides where the slicer goes.
const CommentsProjectPage = (_props: SlotProps<"project.page">) => {
  throwIfRequested("project.comments");
  return (
    <ProjectPageLayout sidebar={<Slicer fields={["hierarchy"]} />}>
      <SlicedComments />
    </ProjectPageLayout>
  );
};

export default CommentsProjectPage;
