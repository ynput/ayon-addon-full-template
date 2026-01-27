import SimpleTable, {
  SimpleTableProvider,
  SimpleTableRow,
} from "@ynput/ayon-frontend-shared/SimpleTable";
import { FC, useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useListProjectsQuery } from "@ynput/ayon-frontend-shared/api";
import { useGetProjectFoldersQuery } from "../api/getFolders";
import CommentsFeed from "./CommentsFeed";

const ProjectsComments: FC = () => {
  // use the pre-made query to get active projects
  const { data: projects = [], isLoading } = useListProjectsQuery({
    active: true,
  });

  // turn projects into table data
  const tableData: SimpleTableRow[] = useMemo(() => {
    return projects.map((project) => ({
      id: project.name,
      name: project.name,
      label: project.name,
      data: { id: project.name },
      subRows: [],
    }));
  }, [projects]);

  const [selectedProjects, setSelectedProjects] = useState<RowSelectionState>(
    {},
  );
  const selectedProjectNames = useMemo(() => {
    return Object.entries(selectedProjects)
      .filter(([, isSelected]) => isSelected)
      .map(([projectName]) => projectName);
  }, [selectedProjects]);

  const { data: projectsFolders = [], error } = useGetProjectFoldersQuery(
    selectedProjectNames,
    { skip: !selectedProjectNames.length },
  );

  return (
    <SimpleTableProvider
      rowSelection={selectedProjects}
      onRowSelectionChange={setSelectedProjects}
    >
      <div style={{ width: 200 }}>
        <SimpleTable data={tableData} isLoading={isLoading} isMultiSelect />
      </div>
      {error && <div>Error loading folders.</div>}
      {!error && !!projectsFolders.length && (
        <CommentsFeed projectArgs={projectsFolders} />
      )}
    </SimpleTableProvider>
  );
};

export default ProjectsComments;
