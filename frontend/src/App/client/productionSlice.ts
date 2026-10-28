import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CommentsSortOrder = "newest" | "oldest";

type ProductionState = {
  /** order of the comment feeds that have no view to keep it in */
  sortOrder: CommentsSortOrder;
  /** the Due in column turns amber this many days before a task is due */
  dueWarningDays: number;
};

const initialState: ProductionState = {
  sortOrder: "newest",
  dueWarningDays: 3,
};

// Addon state that lives in the AYON store (see store.ts), so it survives the addon's
// components unmounting and shows up in the Redux devtools next to the host's state.
export const productionSlice = createSlice({
  // the slice's key in the AYON store: prefix it with the addon name so it can't clash with
  // the host or another addon
  name: "productionAddon",
  initialState,
  reducers: {
    setSortOrder: (state, action: PayloadAction<CommentsSortOrder>) => {
      state.sortOrder = action.payload;
    },
    setDueWarningDays: (state, action: PayloadAction<number>) => {
      state.dueWarningDays = action.payload;
    },
  },
  selectors: {
    selectSortOrder: (state) => state.sortOrder,
    selectDueWarningDays: (state) => state.dueWarningDays,
  },
});

export const { setSortOrder, setDueWarningDays } = productionSlice.actions;
