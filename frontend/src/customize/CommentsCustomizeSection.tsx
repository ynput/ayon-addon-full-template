import { Button } from "@ynput/ayon-react-components";
import type { SlotProps } from "@ynput/ayon-addon";
import { useAppDispatch, useAppSelector } from "@/App/client/hooks";
import { selectSortOrder } from "@/App/client/store";
import { setSortOrder, type CommentsSortOrder } from "@/App/client/commentsSlice";
import { throwIfRequested } from "@/testing";

const ORDERS: { value: CommentsSortOrder; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

// The Comments section of the project tables' Customize panel (projectTable.customizeSection,
// see src/manifest.ts): the order of the addon's comment feeds, kept in the addon's slice of the
// AYON store. AYON loads this when the section is opened.
const CommentsCustomizeSection = ({ page }: SlotProps<"projectTable.customizeSection">) => {
  throwIfRequested("customize.comments");
  const dispatch = useAppDispatch();
  const sortOrder = useAppSelector(selectSortOrder);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8 }}>
      <span>Order of the comment feeds (opened from {page})</span>
      <div style={{ display: "flex", gap: 4 }}>
        {ORDERS.map(({ value, label }) => (
          <Button
            key={value}
            selected={sortOrder === value}
            onClick={() => dispatch(setSortOrder(value))}
            data-sort-order={value}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommentsCustomizeSection;
