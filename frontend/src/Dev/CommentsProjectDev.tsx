// file mimics ayon-frontend structure for development purposes only
// (the store and app level providers come from main.tsx, these are the project page ones)

import { useAppDispatch } from "@/App/client/hooks";
import CommentsProjectPage from "@/pages/CommentsProjectPage";
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

  return (
    <SlicerProvider
      page="comments"
      projectName={projectName}
      viewSettings={undefined}
      isLoadingViews={false}
      updateViewSettings={async () => {}}
    >
      <ProjectContextProvider projectName={projectName}>
        <ProjectFoldersContextProvider projectName={projectName}>
          <ViewsProvider
            viewType="project-comments"
            projectName={projectName}
            dispatch={dispatch}
          >
            <Views />
            <PageWrapper>
              <CommentsProjectPage
                slot="project.page"
                projectName={projectName}
                project={undefined}
              />
            </PageWrapper>
          </ViewsProvider>
        </ProjectFoldersContextProvider>
      </ProjectContextProvider>
    </SlicerProvider>
  );
};

export default CommentsProjectDev;
