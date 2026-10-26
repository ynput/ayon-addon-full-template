import { FC } from "react";
import { useGetCommentsProjectFoldersQuery } from "../api/getFolders";
import CommentsFeed from "./CommentsFeed";
import { Comment } from "../api/getComments";

interface ProjectsCommentsFeedProps {
  projectNames: string[];
  onCommentSelect?: (comment: Comment) => void;
}

// the comments of every folder in the given projects
const ProjectsCommentsFeed: FC<ProjectsCommentsFeedProps> = ({
  projectNames,
  onCommentSelect,
}) => {
  const { data: projectsFolders = [], error } =
    useGetCommentsProjectFoldersQuery(projectNames, {
      skip: !projectNames.length,
    });

  if (!projectNames.length) return <div>Select a project.</div>;
  if (error) return <div>Error loading folders.</div>;
  if (!projectsFolders.length) return null;
  return <CommentsFeed projectArgs={projectsFolders} onSelect={onCommentSelect} />;
};

export default ProjectsCommentsFeed;
