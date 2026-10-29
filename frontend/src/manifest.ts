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
  tableShortcut,
} from "@ynput/ayon-addon/manifest";

export default defineAddon({
  contributes: [
    // /projects/<project>/comments: the project's comments, filtered by the slicer
    projectPage({
      id: "comments",
      title: "Comments",
      viewType: "project-comments",
      component: () => import("./pages/CommentsProjectPage"),
    }),
    // /dashboard/comments, for managers: comments across the picked projects
    studioPage({
      id: "comments",
      title: "Comments",
      access: "manager",
      viewType: "studio-comments",
      component: () => import("./pages/CommentsStudioPage"),
    }),
    // a header button before the inbox, opening a dialog with my tasks due this week. A header or
    // toolbar item sets one action: dialog, menu, run, to (navigate) or component (its own JSX
    // instead of AYON's button)
    headerItem({
      id: "my_deadlines",
      label: "My deadlines",
      icon: "event_upcoming",
      placement: "right",
      dialogTitle: "Due this week",
      dialogSize: "md",
      dialog: () => import("./header/MyDeadlinesDialog"),
    }),
    // a details panel tab with the frame range, fps and resolution of the open entities
    detailsPanelTab({
      id: "specs",
      label: "Shot specs",
      icon: "aspect_ratio",
      entityTypes: ["folder", "task", "version"],
      component: () => import("./panel/ShotSpecsTab"),
    }),
    // "Copy status summary" in the details panel: pinned, so it is a button in the panel's header
    // next to the more menu (without pinned it is an entry in that menu)
    detailsPanelMenuItem({
      id: "copy_summary",
      label: "Copy status summary",
      icon: "summarize",
      entityTypes: ["folder", "task", "version"],
      pinned: true,
      run: () => import("./menu/copyStatusSummary"),
    }),
    // the same item in the tables' right-click menu, at the top next to Copy (position "bottom",
    // the default, puts an item above Delete)
    entityMenuItem({
      id: "copy_summary",
      label: "Copy status summary",
      icon: "summarize",
      entityTypes: ["folder", "task", "version"],
      position: "top",
      run: () => import("./menu/copyStatusSummary"),
    }),
    // and one that writes: only when every selected entity is a task
    entityMenuItem({
      id: "push_due_date",
      label: "Push due date by a day",
      icon: "more_time",
      entityTypes: ["task"],
      run: () => import("./menu/pushDueDate"),
    }),
    // in the project list's right-click menu and its "more" dropdown
    projectListMenuItem({
      id: "export_task_report",
      label: "Export task report (CSV)",
      icon: "download",
      in: ["context", "dropdown"],
      run: () => import("./menu/exportTaskReport"),
    }),
    // in the slicer's right-click menu and panel dropdown, for folders of the hierarchy
    slicerMenuItem({
      id: "copy_shot_list",
      label: "Copy shot list",
      icon: "movie",
      sliceTypes: ["hierarchy"],
      in: ["context", "dropdown"],
      run: () => import("./menu/copyShotList"),
    }),
    // a button in the Overview, Products and Lists toolbars, before Customize
    projectTableToolbarItem({
      id: "statuses",
      icon: "bar_chart",
      label: "Statuses",
      tooltip: "How many are in each status",
      dialogSize: "md",
      dialog: () => import("./toolbar/StatusBreakdownDialog"),
    }),
    // and a menu next to it: AYON opens it under the button, the items come from the addon
    projectTableToolbarItem({
      id: "export",
      icon: "download",
      tooltip: "Export",
      menu: () => import("./toolbar/exportMenu"),
    }),
    // a section in the Overview, Products and Lists Customize panels: sets up the column below
    projectTableCustomizeSection({
      id: "due_dates",
      title: "Due dates",
      icon: "event",
      component: () => import("./customize/DueDatesSection"),
    }),
    // days until a task is due, in the Overview and Lists tables (Products has no tasks)
    tableColumn({
      id: "due_in",
      label: "Due in",
      icon: "event",
      entityTypes: ["task"],
      pages: ["overview", "lists"],
      width: 120,
      cell: () => import("./table/DueInCell"),
      useData: () => import("./table/useDueIn"),
    }),
    // keyboard shortcuts on table cells: Shift+Ctrl/⌘+C copies the status summary of the
    // selected rows in the project tables (the same function as the menu items above). `mod` is
    // ⌘ on macOS and Ctrl elsewhere; AYON's own table keys (arrows, Ctrl+C, r, ...) can't be taken
    tableShortcut({
      id: "copy_summary",
      label: "Copy status summary",
      keys: "shift+mod+c",
      tables: ["overview", "products", "lists"],
      run: () => import("./menu/copyStatusSummary"),
    }),
    // and g opens a dialog with the rows' values, in every table (also the slicer, the project
    // list and the versions panel)
    tableShortcut({
      id: "peek",
      label: "Peek",
      keys: "g",
      dialogTitle: "Peek",
      dialog: () => import("./table/PeekRowsDialog"),
    }),
  ],
});
