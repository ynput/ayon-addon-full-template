import type { SlotProps } from "@ynput/ayon-addon";
import { useAppSelector } from "@/App/client/hooks";
import { selectDueWarningDays } from "@/App/client/store";
import { formatDueIn } from "@/App/utils/dates";
import { throwIfRequested } from "@/testing";

// A cell of the Due in column: `value` is what fetchDueIn returned for its task, days until it is
// due. Red when late, amber within the warning set in the Customize panel (DueDatesSection).
// AYON draws the cell box (padding, selection) and its right-click menu; Copy copies `value`.
const DueInCell = ({ value }: SlotProps<"tableColumn">) => {
  throwIfRequested("table.due_in");
  const warningDays = useAppSelector(selectDueWarningDays);
  if (typeof value !== "number") return null;
  const color =
    value < 0
      ? "var(--md-sys-color-error)"
      : value <= warningDays
        ? "var(--md-sys-color-warning)"
        : undefined;
  return <span style={{ color }}>{formatDueIn(value)}</span>;
};

export default DueInCell;
