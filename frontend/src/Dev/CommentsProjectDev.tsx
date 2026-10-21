// file mimics ayon-frontend structure for development purposes only
// (the store and app level providers come from main.tsx, these are the project page ones)

import { useAppDispatch } from "@/App/client/hooks";
import commentsProjectRemote from "@/Remotes/CommentsProjectRemote";
import { ProjectPageRemote } from "@ynput/ayon-frontend-shared/components";
import {
  ProjectContextProvider,
  ProjectFoldersContextProvider,
} from "@ynput/ayon-frontend-shared/context";
import { SlicerProvider } from "@ynput/ayon-frontend-shared/Slicer";
import { Views, ViewsProvider } from "@ynput/ayon-frontend-shared/Views";
import { FC } from "react";
import PageWrapper from "./PageWrapper";

const CommentsProjectDev: FC = () => {
  const dispatch = useAppDispatch();

  //   @ts-expect-error env var
  const projectName = import.meta.env.VITE_SERVER_URL || "demo_Commercial";
  const viewType = commentsProjectRemote.viewType;

  return (
    <SlicerProvider>
      <ProjectContextProvider projectName={projectName}>
        <ProjectFoldersContextProvider projectName={projectName}>
          <ViewsProvider
            viewType={viewType}
            projectName={projectName}
            dispatch={dispatch}
          >
            <Views />
            <PageWrapper>
              <ProjectPageRemote
                Component={commentsProjectRemote.component}
                slicer={commentsProjectRemote.slicer}
                projectName={projectName}
              />
            </PageWrapper>
          </ViewsProvider>
        </ProjectFoldersContextProvider>
      </ProjectContextProvider>
    </SlicerProvider>
  );
};

export default CommentsProjectDev;
