import type { EntityRef } from "@ynput/ayon-addon";

// A link that opens an entity in AYON with its details panel (and its comments): folders and
// tasks on Overview, products and versions on Products.
export const commentsLink = ({ projectName, entityType, id }: EntityRef) => {
  const page = entityType === "folder" || entityType === "task" ? "overview" : "products";
  const params = new URLSearchParams({ project: projectName, type: entityType, id });
  return `${window.location.origin}/projects/${projectName}/${page}?${params.toString()}`;
};
