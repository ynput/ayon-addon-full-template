import SimpleTable, {
  SimpleTableProvider,
  SimpleTableRow,
} from "@ynput/ayon-frontend-shared/SimpleTable";
import { FC, useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useListProjectsQuery } from "@ynput/ayon-frontend-shared/api";
import { useGetCommentsProjectFoldersQuery } from "../api/getFolders";
import CommentsFeed from "./CommentsFeed";
import { Comment } from "../api/getComments";

interface ProjectsCommentsProps {
  toast?: any;
  onCommentSelect?: (comment: Comment) => void;
}

const ProjectsComments: FC<ProjectsCommentsProps> = ({
  toast,
  onCommentSelect,
}) => {
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

  const { data: projectsFolders = [], error } = useGetCommentsProjectFoldersQuery(
    selectedProjectNames,
    { skip: !selectedProjectNames.length },
  );

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
      {error && <div>Error loading folders.</div>}
      {!error && !!projectsFolders.length && (
        <CommentsFeed
          projectArgs={projectsFolders}
          onSelect={(activityId) =>
            onCommentSelect?.(activityId) || toast?.info("A comment!")
          } // will only show up in ayon-frontend as toast system is not available in this app
        />
      )}
    </SimpleTableProvider>
  );
};

export default ProjectsComments;
