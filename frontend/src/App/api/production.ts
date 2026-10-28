import { dispatch, type EntityRef } from "@ynput/ayon-addon";
import {
  api,
  type GetEntitySummariesQuery,
  type GetShotsQuery,
  type GetTaskReportQuery,
} from "./generated/graphql";

// The production queries (src/App/api/graphql/*.graphql, generated into ./generated), and
// helpers that turn their results into plain rows.
//
// AYON invalidates the `entityActivities` tag of an entity when its status, attributes, tags or
// assignees change, wherever that happens (the tables, the details panel, this addon). Providing
// it per entity makes these queries refetch after any edit, e.g. the Due in column after the due
// date changes.
const entityTags = (ids: string | string[]) =>
  [ids].flat().map((id) => ({ type: "entityActivities" as const, id }));

export const productionApi = api.enhanceEndpoints({
  endpoints: {
    GetEntitySummaries: { providesTags: (_result, _error, { ids }) => entityTags(ids) },
    GetEntitySpecs: { providesTags: (_result, _error, { ids }) => entityTags(ids) },
  },
});

export const { useGetEntitySummariesQuery, useGetEntitySpecsQuery, useGetStatusesQuery } =
  productionApi;

/** The query variables that pick the folders, tasks or versions connection. */
export const entityTypeArgs = (entityType: string) => ({
  folders: entityType === "folder",
  tasks: entityType === "task",
  versions: entityType === "version",
});

export type EntitySummary = {
  id: string;
  entityType: string;
  /** where it is: `sh010 / comp`, `sh010 / plate v003` */
  path: string;
  status: string;
  /** folder type, task type or the version's task */
  kind?: string;
  /** assignees, or the version's author */
  people: string[];
  /** a task's due date (ISO) */
  dueDate?: string;
};

const folderName = (folder?: { name: string; label?: string | null } | null) =>
  folder ? folder.label || folder.name : "";

export const toSummaries = (data: GetEntitySummariesQuery | undefined): EntitySummary[] => {
  const project = data?.project;
  if (!project) return [];
  return [
    ...(project.folders?.edges ?? []).map(({ node }) => ({
      id: node.id,
      entityType: "folder",
      path: folderName(node),
      status: node.status,
      kind: node.folderType,
      people: [],
    })),
    ...(project.tasks?.edges ?? []).map(({ node }) => ({
      id: node.id,
      entityType: "task",
      path: `${folderName(node.folder)} / ${node.label || node.name}`,
      status: node.status,
      kind: node.taskType,
      people: node.assignees,
      dueDate: node.attrib?.endDate ?? undefined,
    })),
    ...(project.versions?.edges ?? []).map(({ node }) => ({
      id: node.id,
      entityType: "version",
      path: `${folderName(node.product.folder)} / ${node.product.name} ${node.name}`,
      status: node.status,
      kind: node.task ? node.task.label || node.task.name : undefined,
      people: node.author ? [node.author] : [],
    })),
  ];
};

// Code outside React (menu items' `run`, toolbar `menu`s) can't use the hooks: it dispatches
// the query to AYON's store with `dispatch` from @ynput/ayon-addon. The result goes through the
// same cache as the hooks.

/** The summaries of the given entities, of any types. */
export const fetchEntitySummaries = async (
  projectName: string,
  entities: Pick<EntityRef, "entityType" | "id">[],
): Promise<EntitySummary[]> => {
  const idsByType: Record<string, string[]> = {};
  for (const { entityType, id } of entities) (idsByType[entityType] ??= []).push(id);
  const results = await Promise.all(
    Object.entries(idsByType).map(([entityType, ids]) =>
      dispatch(
        productionApi.endpoints.GetEntitySummaries.initiate(
          { projectName, ids, ...entityTypeArgs(entityType) },
          { subscribe: false },
        ),
      ).unwrap(),
    ),
  );
  return results.flatMap(toSummaries);
};

export type ShotRow = {
  name: string;
  path: string;
  frameStart?: number;
  frameEnd?: number;
  handleStart?: number;
  handleEnd?: number;
  fps?: number;
};

const toShotRows = (data: GetShotsQuery): ShotRow[] =>
  (data.project.folders.edges ?? [])
    .map(({ node }) => ({ name: node.label || node.name, path: node.path, ...node.attrib }))
    .sort((a, b) => a.path.localeCompare(b.path));

/** Shots under the given folders (or the folders themselves), every shot without folderIds. */
export const fetchShots = async (projectName: string, folderIds?: string[]) =>
  toShotRows(
    await dispatch(
      productionApi.endpoints.GetShots.initiate(
        { projectName, folderIds: folderIds ?? null },
        { subscribe: false, forceRefetch: true },
      ),
    ).unwrap(),
  );

export type TaskReportRow = GetTaskReportQuery["project"]["tasks"]["edges"][number]["node"];

/** Every task of a project. */
export const fetchTaskReport = async (projectName: string): Promise<TaskReportRow[]> => {
  const data = await dispatch(
    productionApi.endpoints.GetTaskReport.initiate(
      { projectName },
      { subscribe: false, forceRefetch: true },
    ),
  ).unwrap();
  return data.project.tasks.edges.map(({ node }) => node);
};
