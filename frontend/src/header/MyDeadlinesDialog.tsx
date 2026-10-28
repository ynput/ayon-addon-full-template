import { useMemo } from "react";
import styled from "styled-components";
import { useUser, type DialogScope, type SlotProps } from "@ynput/ayon-addon";
import { useGetKanbanQuery, useGetProjectsInfoQuery } from "@ynput/ayon-frontend-shared/api";
import { daysUntil, formatDay, formatDueIn } from "@/App/utils/dates";
import { entityPath } from "@/links";
import { throwIfRequested } from "@/testing";

const HORIZON_DAYS = 7;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
`;

const Row = styled.button`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: 110px 60px 1fr auto;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--md-sys-color-surface-container-high-hover);
  }
  .late {
    color: var(--md-sys-color-error);
  }
  .muted {
    color: var(--md-sys-color-outline);
  }
`;

// "My deadlines" in the header (header.item slot, see src/manifest.ts): the signed-in user's
// open tasks due within a week, or late. It sets `dialog`: AYON draws the button and opens its
// dialog around this content; `close` closes it. The header is on every page, so `projectName`
// is the open project or null: with a project open, the list is that project's.
const MyDeadlinesDialog = ({ projectName, navigate, close }: SlotProps<"header.item"> & DialogScope) => {
  throwIfRequested("header.my_deadlines");
  const user = useUser();

  // the tasks of AYON's own dashboard (kept live by AYON); all projects without `projects`
  const { data: tasks = [], isLoading } = useGetKanbanQuery(
    { assignees: user ? [user.name] : [], projects: projectName ? [projectName] : undefined },
    { skip: !user },
  );
  // the projects' statuses, to leave out the done tasks
  const projectNames = useMemo(() => [...new Set(tasks.map((task) => task.projectName))], [tasks]);
  const { data: projects } = useGetProjectsInfoQuery(
    { projects: projectNames, anatomy: false },
    { skip: !projectNames.length },
  );

  const due = useMemo(
    () =>
      tasks
        .flatMap((task) => (typeof task.dueDate === "string" ? [{ ...task, dueDate: task.dueDate }] : []))
        .filter((task) => {
          if (daysUntil(task.dueDate) > HORIZON_DAYS) return false;
          const statuses = projects?.[task.projectName]?.statuses;
          return statuses?.find((status) => status.name === task.status)?.state !== "done";
        })
        .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1)),
    [tasks, projects],
  );

  if (isLoading) return <div>Loading your tasks...</div>;
  if (!due.length) {
    const where = projectName ? ` in ${projectName}` : "";
    return <div>Nothing of yours is due in the next {HORIZON_DAYS} days{where}.</div>;
  }

  return (
    <List>
      {due.map((task) => {
        const days = daysUntil(task.dueDate);
        return (
          <li key={task.id}>
            <Row
              onClick={() => {
                close();
                navigate(entityPath({ projectName: task.projectName, entityType: "task", id: task.id }));
              }}
            >
              <span className={days < 0 ? "late" : undefined}>{formatDueIn(days)}</span>
              <span className="muted">{formatDay(task.dueDate)}</span>
              <span>
                {projectName ? "" : `${task.projectName} · `}
                {task.folderLabel || task.folderName} / {task.label || task.name}
              </span>
              <span className="muted">{task.status}</span>
            </Row>
          </li>
        );
      })}
    </List>
  );
};

export default MyDeadlinesDialog;
