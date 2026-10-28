// specific comments for a project
import { FC, useMemo } from "react";
import type { ProjectFolders } from "@ynput/ayon-addon";
import { ProjectCommentsArgs } from "../api/getComments";
import CommentsFeed, { type CommentsSort } from "./CommentsFeed";

interface ProjectCommentsProps {
  projectName: string;
  /**
   * the project's folders: `projectFolders` of the project.page context, or AYON's
   * ProjectFoldersContext where the slot has none
   */
  projectFolders: Pick<ProjectFolders, "isLoading" | "getChildFolderIds"> & {
    folders: { id: string }[];
  };
  /** ids of the folders selected in the slicer; all folders when empty */
  selectedFolders?: string[];
  sort?: CommentsSort;
}

const ProjectComments: FC<ProjectCommentsProps> = ({
  projectName,
  projectFolders,
  selectedFolders = [],
  sort,
}) => {
  const { folders, isLoading, getChildFolderIds } = projectFolders;

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

  return <CommentsFeed projectArgs={[projectArgs]} sort={sort} />;
};

export default ProjectComments;
