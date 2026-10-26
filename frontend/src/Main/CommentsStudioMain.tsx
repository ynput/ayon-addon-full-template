import ProjectsComments from "@/App/components/ProjectsComments";
import { RemotePageProps } from "@ynput/ayon-frontend-shared/components";

// Rendered inside AYON, which already provides the store, GlobalProvider and
// PowerpackProvider, so no providers are needed here.
const CommentsStudioMain = (props: RemotePageProps) => {
  return <ProjectsComments toast={props.toast} />;
};

export default CommentsStudioMain;
