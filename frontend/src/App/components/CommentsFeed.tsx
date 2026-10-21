import { FC, useMemo } from "react";
import { Button } from "@ynput/ayon-react-components";
import {
  Comment,
  ProjectCommentsArgs,
  useGetCommentsForProjectsQuery,
} from "../api/getComments";
import styled from "styled-components";
import { ActivityCommentItem } from "./ActivityCommentItem";
import { useAppDispatch, useAppSelector } from "../client/hooks";
import { selectSortOrder } from "../client/store";
import { setSortOrder } from "../client/commentsSlice";

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
  onSelect?: (comment: Comment) => void;
}

const CommentsFeed: FC<CommentsFeedProps> = ({ projectArgs, onSelect }) => {
  const {
    data: comments = [],
    error,
    isFetching,
  } = useGetCommentsForProjectsQuery(projectArgs);

  // addon state from the AYON store, kept when the page is closed and opened again
  const dispatch = useAppDispatch();
  const sortOrder = useAppSelector(selectSortOrder);
  const sortedComments = useMemo(() => {
    const sorted = [...comments].sort((a, b) =>
      a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0,
    );
    return sortOrder === "newest" ? sorted.reverse() : sorted;
  }, [comments, sortOrder]);

  if (isFetching) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error loading comments.</div>;
  }

  if (!comments.length) {
    return <div>No comments found.</div>;
  }

  return (
    <StyledFeed>
      <li>
        <Button
          icon={sortOrder === "newest" ? "arrow_downward" : "arrow_upward"}
          variant="text"
          onClick={() =>
            dispatch(
              setSortOrder(sortOrder === "newest" ? "oldest" : "newest"),
            )
          }
        >
          {sortOrder === "newest" ? "Newest first" : "Oldest first"}
        </Button>
      </li>
      {sortedComments.map((comment) => (
        <ActivityCommentItem
          key={comment.activityId}
          author={{
            name: comment.author?.name,
            fullName: comment.author?.attrib.fullName || "",
          }}
          body={comment.body || ""}
          date={comment.createdAt}
          projectName={comment.projectName}
          onClick={() => onSelect?.(comment)}
        />
      ))}
    </StyledFeed>
  );
};

export default CommentsFeed;
