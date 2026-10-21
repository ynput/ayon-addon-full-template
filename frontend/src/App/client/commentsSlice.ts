import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CommentsSortOrder = "newest" | "oldest";

type CommentsState = {
  sortOrder: CommentsSortOrder;
};

const initialState: CommentsState = {
  sortOrder: "newest",
};

// Addon state that lives in the AYON store (see store.ts), so it survives the addon page
// unmounting and shows up in the Redux devtools next to the host's state.
export const commentsSlice = createSlice({
  // the slice's key in the AYON store: prefix it with the addon name so it can't clash with
  // the host or another addon
  name: "commentsAddon",
  initialState,
  reducers: {
    setSortOrder: (state, action: PayloadAction<CommentsSortOrder>) => {
      state.sortOrder = action.payload;
    },
  },
  selectors: {
    selectSortOrder: (state) => state.sortOrder,
  },
});

export const { setSortOrder } = commentsSlice.actions;
