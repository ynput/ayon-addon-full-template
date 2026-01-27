import { store } from "@/App/client/store";
import {
  AddonProjectProvider,
  GlobalProvider,
  PowerpackProvider,
  RemoteAddonProjectProps,
} from "@ynput/ayon-frontend-shared/context";
import { FC } from "react";
import { Provider } from "react-redux";

const CommentsProjectMain: FC<RemoteAddonProjectProps> = (props) => {
  return (
    // redux store to allow for addon to make api calls
    <Provider store={store}>
      {/* provides useful prefetched data */}
      <GlobalProvider>
        {/* required */}
        <PowerpackProvider>
          {/* forwards project specific props for easy access across addon */}
          <AddonProjectProvider {...props}>
            <div>HELLO</div>
          </AddonProjectProvider>
        </PowerpackProvider>
      </GlobalProvider>
    </Provider>
  );
};

export default CommentsProjectMain;
