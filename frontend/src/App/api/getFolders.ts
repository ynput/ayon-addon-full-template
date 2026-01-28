import {
  api,
  FolderListModel,
  foldersApi,
} from "@ynput/ayon-frontend-shared/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Result of the getProjectFolders query: a list of folder IDs.
 */
export type GetProjectFoldersResult = {
  projectName: string;
  folderIds: string[];
}[];

/**
 * Arguments for the getProjectFolders query: a list of project names.
 */
export type GetProjectFoldersArgs = string[];

const foldersInjectedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjectFolders: build.query<GetProjectFoldersResult, string[]>({
      queryFn: async (projectNames, { dispatch }) => {
        try {
          const promises = projectNames.map((projectName) =>
            dispatch(
              foldersApi.endpoints.getFolderList.initiate({ projectName }),
            ),
          );

          const results = await Promise.all(promises);

          const data = results.map(
            (res: { data: FolderListModel }, index: number) => {
              const projectName = projectNames[index];
              const folderIds =
                res?.data?.folders.map((folder) => folder.id) || [];
              return { projectName, folderIds };
            },
          );

          return { data: data };
        } catch (error: unknown) {
          return { error: error as FetchBaseQueryError };
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetProjectFoldersQuery } = foldersInjectedApi;
