// file mimics ayon-frontend structure for development purposes only

import { useAppDispatch } from "@/App/client/hooks";
import commentsStudioRemote from "@/Remotes/CommentsStudioRemote";
import { RemotePageWrapper } from "@ynput/ayon-frontend-shared/components";
import {
  GlobalProvider,
  PowerpackProvider,
} from "@ynput/ayon-frontend-shared/context";
import { Views, ViewsProvider } from "@ynput/ayon-frontend-shared/Views";
import { FC } from "react";
import { WithViews } from "./WithViews";

const CommentsStudioDev: FC = () => {
  const dispatch = useAppDispatch();

  const viewType = commentsStudioRemote.viewType;

  return (
    <GlobalProvider>
      <PowerpackProvider>
        <ViewsProvider
          viewType={viewType}
          projectName={undefined}
          dispatch={dispatch}
        >
          <Views />
          <WithViews viewType={viewType}>
            <RemotePageWrapper Component={commentsStudioRemote.component} />
          </WithViews>
        </ViewsProvider>
      </PowerpackProvider>
    </GlobalProvider>
  );
};

export default CommentsStudioDev;
