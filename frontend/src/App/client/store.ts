import type { ThunkDispatch, UnknownAction, WithSlice } from "@reduxjs/toolkit";
import { api as sharedApi, rootReducer } from "@ynput/ayon-frontend-shared/api";
import { productionSlice } from "./productionSlice";

// The addon has no store of its own. Inside AYON the host provides
// @ynput/ayon-frontend-shared (see the federation config in vite.config.ts), so `api` and
// `rootReducer` here are the host's: queries share the host's cache, invalidating a tag
// refetches host queries too, and slices injected below land in the host store.
// The dev shell (`yarn dev`) stands in for the host with a store of its own.

// inject more tags to the api
const tagTypes = ["comment"] as const;
export const api = sharedApi.enhanceEndpoints({ addTagTypes: tagTypes });

// add the addon's own state to the store
export const injectedProductionSlice = productionSlice.injectInto(rootReducer);
export const { selectSortOrder, selectDueWarningDays } = injectedProductionSlice.selectors;

// The parts of the store the addon knows about. The host store has more, but the addon
// should only rely on the api and its own slices.
export type RootState = ReturnType<typeof rootReducer> &
  WithSlice<typeof productionSlice>;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
