// file mimics ayon-frontend structure for development purposes only
// (the store and app level providers come from main.tsx)

import { useAppDispatch } from "@/App/client/hooks";
import commentsStudioRemote from "@/Remotes/CommentsStudioRemote";
import { RemotePageWrapper } from "@ynput/ayon-frontend-shared/components";
import { Views, ViewsProvider } from "@ynput/ayon-frontend-shared/Views";
import { FC } from "react";
import { WithViews } from "./WithViews";

const CommentsStudioDev: FC = () => {
  const dispatch = useAppDispatch();

  const viewType = commentsStudioRemote.viewType;

  return (
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
  );
};

export default CommentsStudioDev;
