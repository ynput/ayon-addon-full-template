import type { SlotContext } from "@ynput/ayon-addon";
import { exportTaskReport as exportReport } from "@/App/exports";
import { throwIfRequested } from "@/testing";

// "Export task report (CSV)" in the project list's menus (projectList.menuItem, see
// src/manifest.ts): every task of the selected projects, for a producer's spreadsheet.
const exportTaskReport = async ({ projectNames }: SlotContext<"projectList.menuItem">) => {
  throwIfRequested("projects.export_task_report");
  await exportReport(projectNames);
};

export default exportTaskReport;
