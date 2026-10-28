import { toast } from "@ynput/ayon-addon";
import { fetchShots, fetchTaskReport, type ShotRow } from "@/App/api/production";
import { formatDay } from "@/App/utils/dates";
import { downloadCsv } from "@/App/utils/files";
import { frameCount } from "@/App/utils/specs";

// Exports that more than one contribution offers: the project list's menu and the project
// tables' Export menu call the same functions.

/** Every task of the projects, one row each, as a CSV download. */
export const exportTaskReport = async (projectNames: string[]) => {
  const reports = await Promise.all(projectNames.map(fetchTaskReport));
  const rows = reports.flatMap((tasks, index) =>
    tasks.map((task) => [
      projectNames[index],
      task.folder.path,
      task.label || task.name,
      task.taskType,
      task.status,
      task.assignees.join(" "),
      task.attrib?.endDate ? formatDay(task.attrib.endDate) : "",
    ]),
  );
  const fileName =
    projectNames.length === 1 ? `${projectNames[0]}_tasks.csv` : "tasks.csv";
  downloadCsv(fileName, [["Project", "Folder", "Task", "Type", "Status", "Assignees", "Due"], ...rows]);
  toast.success(`${rows.length} tasks exported`);
};

/** The columns of a shot list: what editorial needs to conform the cut. */
export const shotListRows = (shots: ShotRow[]) => [
  ["Shot", "Path", "First frame", "Last frame", "Frames", "Handles", "FPS"],
  ...shots.map((shot) => [
    shot.name,
    shot.path,
    shot.frameStart,
    shot.frameEnd,
    frameCount(shot),
    `${shot.handleStart ?? 0}/${shot.handleEnd ?? 0}`,
    shot.fps,
  ]),
];

/** Every shot of the project, as a CSV download. */
export const exportShotList = async (projectName: string) => {
  const shots = await fetchShots(projectName);
  downloadCsv(`${projectName}_shots.csv`, shotListRows(shots));
  toast.success(`${shots.length} shots exported`);
};
