import { api, CommentFragment, GetCommentsQuery } from "./generated/graphql";
import {
  DefinitionsFromApi,
  FetchBaseQueryError,
  OverrideResultType,
  TagTypesFromApi,
} from "@reduxjs/toolkit/query";

// creates new redux queries to get comments for given projects and folders
const COMMENT_LIST_TAG = { type: "comment" as const, id: "LIST" };
// AYON invalidates this tag when a comment is created, edited or deleted anywhere in the app
// (e.g. the details panel). The addon shares the host's api cache, so providing it here
// refetches the comments feed too.
const ACTIVITY_LIST_TAG = { type: "activity" as const, id: "LIST" };

// because we are transforming the response we need to update the result type
export type Comment = CommentFragment & { projectName: string };
export type GetCommentsResult = Comment[];
type Definitions = DefinitionsFromApi<typeof api>;
type TagTypes = TagTypesFromApi<typeof api>;
// update the definitions to include the new types
type UpdatedDefinitions = Omit<Definitions, "GetComments"> & {
  GetComments: OverrideResultType<
    Definitions["GetComments"],
    GetCommentsResult
  >;
};

const getCommentTags = (result: GetCommentsResult | undefined) =>
  result
    ? [
        ...result.map((node) => ({
          type: "comment" as const,
          id: node.activityId,
        })),
        COMMENT_LIST_TAG,
        ACTIVITY_LIST_TAG,
      ]
    : [COMMENT_LIST_TAG, ACTIVITY_LIST_TAG];

const enhancedApi = api.enhanceEndpoints<TagTypes, UpdatedDefinitions>({
  endpoints: {
    GetComments: {
      transformResponse: (res: GetCommentsQuery) =>
        res.project?.activities.edges
          .filter((edge) => edge?.node)
          .map((edge) => ({
            ...edge!.node!,
            projectName: res.project.name,
          })) ?? [],
      providesTags: (result) => getCommentTags(result),
    },
  },
});

export type ProjectCommentsArgs = {
  projectName: string;
  folderIds: string[];
};

// write a custom query that gets comments for multiple projects
// (basically a light wrapper around the GetComments query)
const injectedApi = enhancedApi.injectEndpoints({
  endpoints: (build) => ({
    GetCommentsForProjects: build.query<
      GetCommentsResult,
      ProjectCommentsArgs[]
    >({
      queryFn: async (args, { dispatch }) => {
        try {
          const promises = args.map((arg) =>
            dispatch(enhancedApi.endpoints.GetComments.initiate(arg)),
          );
          const results = await Promise.all(promises);
          const data = results.flatMap((res) => res.data || []);
          return { data };
        } catch (error: unknown) {
          return { error: error as FetchBaseQueryError };
        }
      },
      providesTags: (result) => getCommentTags(result),
    }),
  }),
});

export const { useGetCommentsQuery } = enhancedApi;
export const { useGetCommentsForProjectsQuery } = injectedApi;
