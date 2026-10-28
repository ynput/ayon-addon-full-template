import { useMemo } from "react";
import styled from "styled-components";
import type { SlotProps } from "@ynput/ayon-addon";
import { entityTypeArgs, useGetEntitySpecsQuery } from "@/App/api/production";
import { frameCount, timecode, type Specs } from "@/App/utils/specs";
import { throwIfRequested } from "@/testing";

const Wrapper = styled.div`
  padding: 8px;
  overflow: auto;

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
  .own {
    color: var(--md-sys-color-primary);
  }
  .mismatch {
    color: var(--md-sys-color-warning);
  }
  .legend {
    color: var(--md-sys-color-outline);
  }
`;

type Column = {
  id: string;
  name: string;
  specs: Specs;
  /** the attributes set on the entity itself (folders and tasks) */
  own?: string[];
  /** what a version is compared with: its task's specs, else its folder's */
  expected?: Specs;
};

type Row = { label: string; keys: (keyof Specs)[]; format: (specs: Specs) => string };

const ROWS: Row[] = [
  {
    label: "Frame range",
    keys: ["frameStart", "frameEnd"],
    format: (s) => (s.frameStart != null ? `${s.frameStart}–${s.frameEnd}` : "–"),
  },
  {
    label: "Handles",
    keys: ["handleStart", "handleEnd"],
    format: (s) => `${s.handleStart ?? 0} / ${s.handleEnd ?? 0}`,
  },
  {
    label: "Duration",
    keys: ["frameStart", "frameEnd", "fps"],
    format: (s) => {
      const frames = frameCount(s);
      if (frames == null) return "–";
      return s.fps ? `${frames} f · ${timecode(frames, s.fps)}` : `${frames} f`;
    },
  },
  { label: "FPS", keys: ["fps"], format: (s) => (s.fps != null ? String(s.fps) : "–") },
  {
    label: "Resolution",
    keys: ["resolutionWidth", "resolutionHeight", "pixelAspect"],
    format: (s) =>
      s.resolutionWidth
        ? `${s.resolutionWidth}×${s.resolutionHeight}${s.pixelAspect && s.pixelAspect !== 1 ? ` (${s.pixelAspect})` : ""}`
        : "–",
  },
];

// The Shot specs tab of the details panel (detailsPanel.tab slot, see src/manifest.ts): frame
// range, handles, duration, fps and resolution of the open folders, tasks or versions, one column
// each. On folders and tasks a value set on the entity itself (not inherited) is highlighted; on
// versions a value that differs from the shot is flagged, as the publish no longer matches it.
// The panel opens in many places (project pages, the dashboard, the inbox), so everything comes
// from the slot context.
const ShotSpecsTab = ({ projectName, entityType, entities }: SlotProps<"detailsPanel.tab">) => {
  throwIfRequested("panel.specs");
  const ids = useMemo(() => entities.map((entity) => entity.id), [entities]);
  const { data, isLoading, error } = useGetEntitySpecsQuery(
    { projectName, ids, ...entityTypeArgs(entityType) },
    { skip: !ids.length },
  );

  const columns = useMemo((): Column[] => {
    const project = data?.project;
    if (!project) return [];
    return [
      ...(project.folders?.edges ?? []).map(({ node }) => ({
        id: node.id,
        name: node.label || node.name,
        specs: node.attrib,
        own: node.ownAttrib,
      })),
      ...(project.tasks?.edges ?? []).map(({ node }) => ({
        id: node.id,
        name: node.label || node.name,
        specs: node.attrib,
        own: node.ownAttrib,
      })),
      ...(project.versions?.edges ?? []).map(({ node }) => ({
        id: node.id,
        name: `${node.product.name} ${node.name}`,
        specs: node.attrib,
        expected: node.task?.attrib ?? node.product.folder.attrib,
      })),
    ];
  }, [data]);

  if (isLoading) return <div style={{ padding: 8 }}>Loading specs...</div>;
  if (error) return <div style={{ padding: 8 }}>Could not load the specs.</div>;

  const cellClass = (column: Column, keys: (keyof Specs)[]) => {
    if (column.expected && keys.some((key) => column.specs[key] !== column.expected?.[key]))
      return "mismatch";
    if (column.own && keys.some((key) => column.own?.includes(key))) return "own";
    return undefined;
  };

  return (
    <Wrapper>
      <table>
        {columns.length > 1 && (
          <thead>
            <tr>
              <th />
              {columns.map((column) => (
                <th key={column.id}>{column.name}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cellClass(column, row.keys)}
                  title={column.expected ? `Shot: ${row.format(column.expected)}` : undefined}
                >
                  {row.format(column.specs)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="legend">
        {entityType === "version" ? (
          <>
            <span className="mismatch">Amber</span>: the
            published value differs from the shot (hover for the shot's).
          </>
        ) : (
          <>
            <span className="own">Highlighted</span>: set on this {entityType}, not
            inherited.
          </>
        )}
      </p>
    </Wrapper>
  );
};

export default ShotSpecsTab;
