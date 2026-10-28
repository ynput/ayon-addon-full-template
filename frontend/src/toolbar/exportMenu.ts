import type { AddonMenuItem, SlotContext } from "@ynput/ayon-addon";
import { exportShotList, exportTaskReport } from "@/App/exports";
import { throwIfRequested } from "@/testing";

// The Export button in the project tables' toolbar (projectTable.toolbarItem, see
// src/manifest.ts). It sets `menu`: AYON opens its own menu under the button with these items,
// built each time it opens. The task report is the same one the project list's menu exports.
const exportMenu = ({ projectName }: SlotContext<"projectTable.toolbarItem">): AddonMenuItem[] => {
  throwIfRequested("toolbar.export");
  return [
    {
      id: "tasks",
      label: "Task report (CSV)",
      icon: "checklist",
      onClick: () => exportTaskReport([projectName]),
    },
    {
      id: "shots",
      label: "Shot list (CSV)",
      icon: "movie",
      onClick: () => exportShotList(projectName),
    },
  ];
};

export default exportMenu;
