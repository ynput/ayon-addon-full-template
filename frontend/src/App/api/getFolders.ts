import {
  api,
  FolderListModel,
  foldersApi,
} from "@ynput/ayon-frontend-shared/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Result of the getCommentsProjectFolders query: a list of folder IDs.
 */
export type GetProjectFoldersResult = {
  projectName: string;
  folderIds: string[];
}[];

/**
 * Arguments for the getCommentsProjectFolders query: a list of project names.
 */
export type GetProjectFoldersArgs = string[];

// Endpoints are injected into the AYON api, which every addon and AYON itself share. Prefix
// endpoint names with the addon name: with overrideExisting: false an endpoint whose name is
// already taken (AYON has its own getProjectFolders) is skipped and the existing one is used.
const foldersInjectedApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCommentsProjectFolders: build.query<GetProjectFoldersResult, string[]>({
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

export const { useGetCommentsProjectFoldersQuery } = foldersInjectedApi;
