// specific comments for a project
import { useProjectFoldersContext } from "@ynput/ayon-frontend-shared/context";
import { FC, useMemo } from "react";
import { ProjectCommentsArgs } from "../api/getComments";
import CommentsFeed from "./CommentsFeed";

interface ProjectCommentsProps {
  projectName: string;
  /** ids of the folders selected in the slicer; all folders when empty */
  selectedFolders?: string[];
}

const ProjectComments: FC<ProjectCommentsProps> = ({
  projectName,
  selectedFolders = [],
}) => {
  const { folders, isLoading, getChildFolderIds } = useProjectFoldersContext();

  //   get all folders for when there is no selection
  const allFolderIds = useMemo(
    () => folders.map((folder) => folder.id),
    [folders],
  );

  const selectedFolderIds = useMemo(() => {
    if (!selectedFolders.length) {
      return allFolderIds;
    }

    // get all child ids as well as selected
    const folderIds = getChildFolderIds(selectedFolders, true);

    // unique list
    return Array.from(new Set(folderIds));
  }, [selectedFolders, allFolderIds, getChildFolderIds]);

  const projectArgs: ProjectCommentsArgs = {
    projectName,
    folderIds: selectedFolderIds,
  };

  if (isLoading || !allFolderIds.length) {
    return <div>Loading folders...</div>;
  }

  return <CommentsFeed projectArgs={[projectArgs]} />;
};

export default ProjectComments;
