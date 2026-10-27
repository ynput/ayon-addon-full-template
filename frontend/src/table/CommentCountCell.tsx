import type { SlotProps } from "@ynput/ayon-addon";
import { throwIfRequested } from "@/testing";

// A cell of the comment count column: `value` is what useCommentCounts returned for its entity.
// AYON draws the cell box (padding, selection) and its right-click menu; Copy copies `value`.
const CommentCountCell = ({ value }: SlotProps<"tableColumn">) => {
  throwIfRequested("table.comment_count");
  if (typeof value !== "number") return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        color: value ? undefined : "var(--md-sys-color-outline)",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
        chat
      </span>
      {value}
    </div>
  );
};

export default CommentCountCell;
