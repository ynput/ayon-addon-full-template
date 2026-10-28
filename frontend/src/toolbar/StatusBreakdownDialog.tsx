import { useMemo } from "react";
import styled from "styled-components";
import type { DialogScope, SlotProps } from "@ynput/ayon-addon";
import { useGetProjectQuery } from "@ynput/ayon-frontend-shared/api";
import { useGetStatusesQuery } from "@/App/api/production";
import { throwIfRequested } from "@/testing";

const Bar = styled.div`
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const Rows = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    padding: 4px 0;
  }
  td:not(:first-child) {
    text-align: right;
    color: var(--md-sys-color-outline);
  }
`;

const WHAT = { overview: "tasks", products: "latest versions", lists: "items" } as const;

// The Statuses button in the project tables' toolbar (projectTable.toolbarItem, see
// src/manifest.ts): how many of what the table shows are in each status. The table decides
// what that is: tasks on Overview, the latest version of each product on Products, the open
// list's items on Lists (`list`). It sets `dialog`: AYON draws the button before Customize and
// opens its dialog around this content.
const StatusBreakdownDialog = ({ projectName, page, list }: SlotProps<"projectTable.toolbarItem"> & DialogScope) => {
  throwIfRequested("toolbar.statuses");
  const { data, isLoading } = useGetStatusesQuery({
    projectName,
    tasks: page === "overview",
    versions: page === "products",
    list: page === "lists" && !!list,
    listId: list?.id ?? "",
  });
  // the project's statuses, for their order and colors
  const { data: project } = useGetProjectQuery({ projectName });

  const counts = useMemo(() => {
    const nodes = [
      ...(data?.project.tasks?.edges ?? []),
      ...(data?.project.versions?.edges ?? []),
      ...(data?.project.entityList?.items.edges ?? []),
    ].map((edge) => edge.node);
    const byStatus: Record<string, number> = {};
    for (const node of nodes) {
      if (node && "status" in node) byStatus[node.status] = (byStatus[node.status] ?? 0) + 1;
    }
    const known = (project?.statuses ?? []).map((status) => ({
      name: status.name,
      color: status.color,
      count: byStatus[status.name] ?? 0,
    }));
    return { total: nodes.length, statuses: known.filter((status) => status.count) };
  }, [data, project]);

  if (isLoading) return <div>Counting...</div>;
  if (page === "lists" && !list) return <div>Open a list to see its statuses.</div>;
  if (!counts.total) return <div>There are no {WHAT[page]} here yet.</div>;

  return (
    <div>
      <p>
        {counts.total} {WHAT[page]}
        {list ? ` in ${list.label}` : ` in ${projectName}`}
      </p>
      <Bar>
        {counts.statuses.map((status) => (
          <div
            key={status.name}
            title={`${status.name}: ${status.count}`}
            style={{ flex: status.count, backgroundColor: status.color }}
          />
        ))}
      </Bar>
      <Rows>
        <tbody>
          {counts.statuses.map((status) => (
            <tr key={status.name}>
              <td style={{ color: status.color }}>{status.name}</td>
              <td>{status.count}</td>
              <td>{Math.round((status.count / counts.total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </Rows>
    </div>
  );
};

export default StatusBreakdownDialog;
