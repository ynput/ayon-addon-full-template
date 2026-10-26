// What this addon contributes to AYON's slots. AYON loads this module at startup (it is exposed
// as ./manifest and listed in frontend_modules), so keep it to descriptions: every component is
// a dynamic import that AYON loads when its slot needs it.
import {
  defineAddon,
  detailsPanelMenuItem,
  detailsPanelTab,
  headerItem,
  projectPage,
  studioPage,
} from "@ynput/ayon-addon/manifest";

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
    // a header button next to Home, opening a dialog with the comments of picked projects
    headerItem({
      id: "comments",
      label: "Comments",
      icon: "chat",
      placement: "left",
      component: () => import("./header/CommentsDialog"),
    }),
    // a details panel tab with the comments on the open folders, tasks and versions
    detailsPanelTab({
      id: "comments",
      label: "Comments",
      icon: "chat",
      entityTypes: ["folder", "task", "version"],
      component: () => import("./panel/CommentsTab"),
    }),
    // "Copy comment link" in the details panel's more menu
    detailsPanelMenuItem({
      id: "copy_comment_link",
      label: "Copy comment link",
      icon: "add_link",
      entityTypes: ["folder", "task", "version"],
      run: () => import("./menu/copyCommentLink"),
    }),
  ],
});
