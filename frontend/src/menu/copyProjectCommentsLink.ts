import { toast, type SlotContext } from "@ynput/ayon-addon";
import { throwIfRequested } from "@/testing";

// "Copy comments page link" in the project list's menus (projectList.menuItem, see
// src/manifest.ts): links to the Comments page of each selected project.
const copyProjectCommentsLink = async ({ projectNames }: SlotContext<"projectList.menuItem">) => {
  throwIfRequested("projects.copy_comments_link");
  const links = projectNames.map(
    (projectName) => `${window.location.origin}/projects/${projectName}/comments`,
  );
  await navigator.clipboard.writeText(links.join("\n"));
  toast.success(
    projectNames.length === 1
      ? `Link to the comments of ${projectNames[0]} copied`
      : `Links to the comments of ${projectNames.length} projects copied`,
  );
};

export default copyProjectCommentsLink;
