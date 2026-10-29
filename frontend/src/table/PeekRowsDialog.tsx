import { useState } from "react";
import styled from "styled-components";
import type { DialogScope, SlotProps, TableRowRef } from "@ynput/ayon-addon";
import { throwIfRequested } from "@/testing";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 60vh;
  overflow-y: auto;

  .rows {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .rows button {
    all: unset;
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    &.active {
      background-color: var(--md-sys-color-primary-container);
    }
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    text-align: left;
    padding: 4px 8px;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }
  th {
    font-weight: normal;
    color: var(--md-sys-color-outline);
  }
  .focused {
    color: var(--md-sys-color-primary);
  }
`;

const format = (value: unknown) =>
  Array.isArray(value) ? value.join(", ") : value === null || value === undefined || value === "" ? "–" : String(value);

/** The row's own values and its attributes, keyed like the table's column ids (`attrib_fps`). */
const fields = ({ data }: TableRowRef) => {
  const own = Object.entries(data).filter(([, value]) => typeof value !== "object" || Array.isArray(value));
  const attrib = data.attrib && typeof data.attrib === "object" ? Object.entries(data.attrib) : [];
  return [...own, ...attrib.map(([key, value]) => [`attrib_${key}`, value] as const)];
};

// "Peek" (table.shortcut slot, see src/manifest.ts): press g in a table cell and AYON opens this
// in its dialog with the rows the key acts on: the selected rows when it was pressed in one of
// them, else its own row. `focused` is where it was pressed; its column is highlighted.
const PeekRowsDialog = ({ table, rows, focused }: SlotProps<"table.shortcut"> & DialogScope) => {
  throwIfRequested("table.peek");
  const [rowId, setRowId] = useState(focused.rowId);
  const row = rows.find((r) => r.id === rowId) || rows[0];

  return (
    <Wrapper>
      {rows.length > 1 && (
        <div className="rows">
          {rows.map((r) => (
            <button key={r.id} className={r.id === row.id ? "active" : undefined} onClick={() => setRowId(r.id)}>
              {r.label || r.name || r.id}
            </button>
          ))}
        </div>
      )}
      <table>
        <tbody>
          {fields(row).map(([key, value]) => (
            <tr key={key} className={row.id === focused.rowId && key === focused.columnId ? "focused" : undefined}>
              <th>{key}</th>
              <td>{format(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small>
        {row.entityType || "row"} {row.id} in {table}
      </small>
    </Wrapper>
  );
};

export default PeekRowsDialog;
