// What this addon contributes to AYON's slots. AYON loads this module at startup (it is exposed
// as ./manifest and listed in frontend_modules), so keep it to descriptions: every component is
// a dynamic import that AYON loads when its slot needs it.
import {
  defineAddon,
  detailsPanelMenuItem,
  detailsPanelTab,
  entityMenuItem,
  headerItem,
  projectListMenuItem,
  projectPage,
  projectTableCustomizeSection,
  projectTableToolbarItem,
  slicerMenuItem,
  studioPage,
  tableColumn,
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
      viewType: "studio-comments",
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
    // the same item in the tables' right-click menu, for one selected entity: at the top, next
    // to Copy (position "bottom", the default, puts an item above Delete)
    entityMenuItem({
      id: "copy_comment_link",
      label: "Copy comment link",
      icon: "add_link",
      entityTypes: ["folder", "task", "version"],
      selection: "single",
      position: "top",
      run: () => import("./menu/copyCommentLink"),
    }),
    // in the project list's right-click menu and its "more" dropdown
    projectListMenuItem({
      id: "copy_comments_page_link",
      label: "Copy comments page link",
      icon: "add_link",
      in: ["context", "dropdown"],
      run: () => import("./menu/copyProjectCommentsLink"),
    }),
    // in the slicer's right-click menu and panel dropdown, for folders of the hierarchy
    slicerMenuItem({
      id: "copy_comment_link",
      label: "Copy comment link",
      icon: "add_link",
      sliceTypes: ["hierarchy"],
      in: ["context", "dropdown"],
      run: () => import("./menu/copyFolderCommentLinks"),
    }),
    // a button in the Overview, Products and Lists toolbars, before Customize
    projectTableToolbarItem({
      id: "comments",
      icon: "chat",
      label: "Comments",
      tooltip: "Comments in this project",
      component: () => import("./toolbar/CommentsToolbarDialog"),
    }),
    // a section in the Overview, Products and Lists Customize panels
    projectTableCustomizeSection({
      id: "comments",
      title: "Comments",
      icon: "chat",
      component: () => import("./customize/CommentsCustomizeSection"),
    }),
    // number of comments, in the Overview, Products and Lists tables
    tableColumn({
      id: "comment_count",
      label: "Comments",
      icon: "chat",
      entityTypes: ["folder", "task", "version"],
      width: 110,
      cell: () => import("./table/CommentCountCell"),
      useData: () => import("./table/useCommentCounts"),
    }),
  ],
});
