// Only used on the dev server (main.tsx). Inside AYON the addon uses the host store.
import { createStandaloneStore } from "@ynput/ayon-frontend-shared/api";

// Same root reducer and middleware as the host store, so the addon behaves the same way
export const devStore = createStandaloneStore();
