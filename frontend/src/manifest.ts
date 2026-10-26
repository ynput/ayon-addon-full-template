// What this addon contributes to AYON's slots. AYON loads this module at startup (it is exposed
// as ./manifest and listed in frontend_modules), so keep it to descriptions: every component is
// a dynamic import that AYON loads when its slot needs it.
import { defineAddon, projectPage, studioPage } from "@ynput/ayon-addon/manifest";

export default defineAddon({
  contributes: [
    // /projects/<project>/comments
    projectPage({
      id: "comments",
      title: "Comments",
      viewType: "project-comments",
      component: () => import("./pages/CommentsProjectPage"),
    }),
    // /dashboard/comments, for managers: it lists comments across projects
    studioPage({
      id: "comments",
      title: "Comments",
      access: "manager",
      component: () => import("./pages/CommentsStudioPage"),
    }),
  ],
});
