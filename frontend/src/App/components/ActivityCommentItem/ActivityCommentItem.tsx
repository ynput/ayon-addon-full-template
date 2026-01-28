import clsx from "clsx";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import { Icon } from "@ynput/ayon-react-components";
import * as Styled from "./ActivityCommentItem.styled";
import { codeTag, blockquoteTag } from "./markdownComponents";
import { UserImage } from "@ynput/ayon-frontend-shared/components";

// Reaction mapping for display
const reactionMappingObj: Record<string, string> = {
  thumb_up: "👍",
  thumb_down: "👎",
  heart_plus: "❤️",
  celebration: "🎉",
  notes: "📝",
};

export interface ActivityCommentItemFile {
  id?: string;
  name?: string;
  mime?: string;
  size?: string | number;
}

export interface ActivityCommentItemReaction {
  type: string;
  users?: string[];
}

export interface ActivityCommentItemAuthor {
  name?: string;
  fullName?: string;
}

export interface ActivityCommentItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Unique identifier for the comment */
  id?: string;
  /** Comment body text (supports markdown) */
  body?: string;
  /** Author information */
  author?: ActivityCommentItemAuthor;
  /** Date of the comment (ISO string or formatted string) */
  date?: string;
  /** Attached files */
  files?: ActivityCommentItemFile[];
  /** Reactions on the comment */
  reactions?: ActivityCommentItemReaction[];
  /** Whether the comment is highlighted */
  isHighlighted?: boolean;
  /** Project name for file URLs */
  projectName?: string;
}

/**
 * A simplified, read-only activity comment component.
 * Designed for easy integration in external applications.
 * All props are optional with sensible defaults.
 */
const ActivityCommentItem = ({
  id,
  body = "",
  author,
  date,
  files = [],
  reactions = [],
  isHighlighted,
  projectName,
  ...props
}: ActivityCommentItemProps) => {
  const authorName = author?.name || "";
  const authorFullName = author?.fullName || authorName || "Unknown";

  // Format date for display
  const formattedDate = useMemo(() => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  }, [date]);

  // Check if file is an image
  const isImage = (mime?: string) => mime?.startsWith("image/");

  // Get file URL
  const getFileUrl = (file: ActivityCommentItemFile) => {
    if (!file.id || !projectName) return undefined;
    return `/api/projects/${projectName}/files/${file.id}`;
  };

  return (
    <Styled.Comment
      {...props}
      className={clsx("activity-comment-item", props.className, {
        isHighlighted,
      })}
      id={id}
    >
      {/* Header */}
      <Styled.Header>
        <Styled.HeaderBody>
          {authorName ? (
            <UserImage name={authorName} size={22} />
          ) : (
            <Icon icon="account_circle" />
          )}
          <h5>{authorFullName}</h5>
        </Styled.HeaderBody>
        {formattedDate && <Styled.Date>{formattedDate}</Styled.Date>}
      </Styled.Header>

      {/* Body */}
      <Styled.Body>
        <Styled.CommentWrapper>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, emoji]}
            urlTransform={(url) => url}
            components={{
              // Code blocks
              // @ts-expect-error - props
              code: (props) => codeTag(props),
              // Blockquotes
              // @ts-expect-error - props
              blockquote: (props) => blockquoteTag(props),
              // Checkboxes (read-only)
              input: ({ type, checked, ...props }) => {
                if (type === "checkbox") {
                  return (
                    <input
                      type="checkbox"
                      checked={!!checked}
                      disabled
                      style={{ marginRight: "8px" }}
                      {...props}
                    />
                  );
                }
                return <input type={type} disabled {...props} />;
              },
            }}
          >
            {body}
          </ReactMarkdown>
        </Styled.CommentWrapper>

        {/* Files */}
        {files.length > 0 && (
          <Styled.FilesGrid>
            {files.map((file, index) => (
              <Styled.FileCard key={file.id || index}>
                {isImage(file.mime) && getFileUrl(file) ? (
                  <img src={getFileUrl(file)} alt={file.name || "attachment"} />
                ) : (
                  <>
                    <Icon icon="description" />
                    <Styled.FileName>{file.name || "File"}</Styled.FileName>
                  </>
                )}
              </Styled.FileCard>
            ))}
          </Styled.FilesGrid>
        )}

        {/* Reactions (read-only display) */}
        {reactions.length > 0 && (
          <Styled.ReactionsWrapper>
            {reactions.map((reaction) => (
              <Styled.Reaction
                key={reaction.type}
                data-tooltip={reaction.users?.join(", ")}
              >
                <span className="emoji">
                  {reactionMappingObj[reaction.type] || reaction.type}
                </span>
                {reaction.users && reaction.users.length > 0 && (
                  <span>{reaction.users.length}</span>
                )}
              </Styled.Reaction>
            ))}
          </Styled.ReactionsWrapper>
        )}
      </Styled.Body>
    </Styled.Comment>
  );
};

export default ActivityCommentItem;
