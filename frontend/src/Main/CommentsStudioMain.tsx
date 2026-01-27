import { store } from "@/App/client/store";
import ProjectsComments from "@/App/components/ProjectsComments";
import { RemotePageProps } from "@ynput/ayon-frontend-shared/components";
import {
  GlobalProvider,
  PowerpackProvider,
} from "@ynput/ayon-frontend-shared/context";
import { Provider } from "react-redux";

const CommentsStudioMain = (props: RemotePageProps) => {
  return (
    // redux store to allow for addon to make api calls
    <Provider store={store}>
      {/* provides useful prefetched data */}
      <GlobalProvider>
        {/* required */}
        <PowerpackProvider>
          <ProjectsComments />
        </PowerpackProvider>
      </GlobalProvider>
    </Provider>
  );
};

export default CommentsStudioMain;
