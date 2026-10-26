import SimpleTable, {
  SimpleTableProvider,
  SimpleTableRow,
} from "@ynput/ayon-frontend-shared/SimpleTable";
import { FC, useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useListProjectsQuery } from "@ynput/ayon-frontend-shared/api";
import ProjectsCommentsFeed from "./ProjectsCommentsFeed";
import { Comment } from "../api/getComments";

interface ProjectsCommentsProps {
  onCommentSelect?: (comment: Comment) => void;
}

// a project picker next to the comments of the picked projects, for places without AYON's
// project list (the header dialog). Studio pages use <ProjectList> instead.
const ProjectsComments: FC<ProjectsCommentsProps> = ({ onCommentSelect }) => {
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

  return (
    <SimpleTableProvider
      rowSelection={selectedProjects}
      onRowSelectionChange={setSelectedProjects}
    >
      <div
        style={{
          width: 200,
          height: "100%",
          backgroundColor: "var(--md-sys-color-surface-container-low)",
        }}
      >
        <SimpleTable
          data={tableData}
          isLoading={isLoading}
          isMultiSelect
          enableClickToDeselect
        />
      </div>
      <ProjectsCommentsFeed
        projectNames={selectedProjectNames}
        onCommentSelect={onCommentSelect}
      />
    </SimpleTableProvider>
  );
};

export default ProjectsComments;
