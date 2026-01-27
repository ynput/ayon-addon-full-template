// specific comments for a project
import {
  useAddonProjectContext,
  useProjectFoldersContext,
} from "@ynput/ayon-frontend-shared/context";
import { FC, useMemo } from "react";
import { ProjectCommentsArgs } from "../api/getComments";
import CommentsFeed from "./CommentsFeed";

const ProjectComments: FC = () => {
  const { projectName, state } = useAddonProjectContext();
  const { folders, isLoading, getChildFolderIds } = useProjectFoldersContext();

  //   get all folders for when there is no selection
  const allFolderIds = useMemo(
    () => folders.map((folder) => folder.id),
    [folders],
  );

  const rowSelection = state.slicer.rowSelection;
  const selectedFolderIds = useMemo(() => {
    const selection =
      rowSelection && Object.keys(rowSelection).length > 0
        ? Object.entries(rowSelection).flatMap(([folderId, isSelected]) =>
            isSelected ? [folderId] : [],
          )
        : [];

    if (!selection.length) {
      return allFolderIds;
    }

    // get all child ids as well as selected
    const folderIds = getChildFolderIds(selection, true);

    // unique list
    return Array.from(new Set(folderIds));
  }, [rowSelection, allFolderIds, getChildFolderIds]);

  const projectArgs: ProjectCommentsArgs = {
    projectName: projectName as string,
    folderIds: selectedFolderIds,
  };

  if (isLoading || !allFolderIds.length) {
    return <div>Loading folders...</div>;
  }

  return <CommentsFeed projectArgs={[projectArgs]} />;
};

export default ProjectComments;
