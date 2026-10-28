import { Button } from "@ynput/ayon-react-components";
import { useAppDispatch, useAppSelector } from "@/App/client/hooks";
import { selectDueWarningDays } from "@/App/client/store";
import { setDueWarningDays } from "@/App/client/productionSlice";
import { throwIfRequested } from "@/testing";

const CHOICES = [1, 2, 3, 5, 7];

// The Due dates section of the project tables' Customize panel (projectTable.customizeSection,
// see src/manifest.ts): how many days before a task is due the addon's Due in column turns
// amber. The setting is in the addon's slice of the AYON store, which the column's cells read.
// AYON loads this when the section is opened.
const DueDatesSection = () => {
  throwIfRequested("customize.due_dates");
  const dispatch = useAppDispatch();
  const warningDays = useAppSelector(selectDueWarningDays);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8 }}>
      <span>Warn this many days before a task is due (the Due in column)</span>
      <div style={{ display: "flex", gap: 4 }}>
        {CHOICES.map((days) => (
          <Button
            key={days}
            selected={warningDays === days}
            onClick={() => dispatch(setDueWarningDays(days))}
            data-days={days}
          >
            {days}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DueDatesSection;
