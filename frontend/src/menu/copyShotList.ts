import { toast, type SlotContext } from "@ynput/ayon-addon";
import { fetchShots } from "@/App/api/production";
import { shotListRows } from "@/App/exports";
import { toTsv } from "@/App/utils/files";
import { throwIfRequested } from "@/testing";

// "Copy shot list" in the slicer's right-click menu and panel dropdown, hierarchy only
// (slicer.menuItem, see src/manifest.ts): the shots under the selected folders with their frame
// ranges, tab separated so they paste into a spreadsheet or an edit list.
const copyShotList = async ({ projectName, selected }: SlotContext<"slicer.menuItem">) => {
  throwIfRequested("slicer.copy_shot_list");
  const folderIds = selected.filter((row) => row.entityType !== "task").map((row) => row.id);
  const shots = await fetchShots(projectName, folderIds);
  if (!shots.length) {
    toast.info("No shots in the selected folders");
    return;
  }
  await navigator.clipboard.writeText(toTsv(shotListRows(shots)));
  toast.success(`${shots.length} shot${shots.length === 1 ? "" : "s"} copied`);
};

export default copyShotList;
