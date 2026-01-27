import { store } from "@/App/client/store";
import ProjectComments from "@/App/components/ProjectComments";
import {
  AddonProjectProvider,
  GlobalProvider,
  PowerpackProvider,
  RemoteAddonProjectProps,
} from "@ynput/ayon-frontend-shared/context";
import { Provider } from "react-redux";

const CommentsProjectMain = (props: RemoteAddonProjectProps) => {
  return (
    // redux store to allow for addon to make api calls
    <Provider store={store}>
      {/* provides useful prefetched data */}
      <GlobalProvider>
        {/* required */}
        <PowerpackProvider>
          {/* forwards project specific props for easy access across addon */}
          <AddonProjectProvider {...props}>
            <ProjectComments />
          </AddonProjectProvider>
        </PowerpackProvider>
      </GlobalProvider>
    </Provider>
  );
};

export default CommentsProjectMain;
