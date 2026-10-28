import type { EntityRef } from "@ynput/ayon-addon";

// The AYON URL that opens an entity with its details panel: folders and tasks on Overview,
// products and versions on Products. Pass it to `navigate`, or prefix the origin to share it.
export const entityPath = ({ projectName, entityType, id }: EntityRef) => {
  const page = entityType === "folder" || entityType === "task" ? "overview" : "products";
  const params = new URLSearchParams({ project: projectName, type: entityType, id });
  return `/projects/${projectName}/${page}?${params.toString()}`;
};
