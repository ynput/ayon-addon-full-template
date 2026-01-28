import { FC } from "react";
import {
  ProjectCommentsArgs,
  useGetCommentsForProjectsQuery,
} from "../api/getComments";
import styled from "styled-components";
import { ActivityCommentItem } from "./ActivityCommentItem";

const StyledFeed = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: column;
  gap: 12px;

  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

interface CommentsFeedProps {
  projectArgs: ProjectCommentsArgs[];
  onSelect?: () => void;
}

const CommentsFeed: FC<CommentsFeedProps> = ({ projectArgs, onSelect }) => {
  const {
    data: comments = [],
    error,
    isFetching,
  } = useGetCommentsForProjectsQuery(projectArgs);

  if (isFetching) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error loading comments.</div>;
  }

  return (
    <StyledFeed>
      {comments.map((comment) => (
        <ActivityCommentItem
          key={comment.activityId}
          author={{
            name: comment.author?.name,
            fullName: comment.author?.attrib.fullName || "",
          }}
          body={comment.body || ""}
          date={comment.createdAt}
          projectName={comment.projectName}
          onClick={() => onSelect?.()}
        />
      ))}
    </StyledFeed>
  );
};

export default CommentsFeed;
