# Agent instructions

This addon (`addon-full-template`, a Comments feed) is the template for AYON addons with a frontend,
and the test ground for AYON's addon slots. The frontend is in `frontend/`, the server part in
`server/`.

## How the frontend gets into AYON: slots

AYON has named places in its UI, **slots** (`project.page`, `studio.page`, `header.item`, ...). The
addon lists what it puts into them in one module, `frontend/src/manifest.ts`:

```ts
import { defineAddon, projectPage } from "@ynput/ayon-addon/manifest";

export default defineAddon({
  contributes: [
    projectPage({
      id: "comments", // the URL segment: /projects/<project>/comments
      title: "Comments",
      component: () => import("./pages/CommentsProjectPage"),
    }),
  ],
});
```

- A contribution is a **description** (id, title, icon, ...) that AYON reads at startup, plus
  **pieces**: dynamic imports (`() => import("./File")`) that AYON loads when the slot needs them.
  Never import a component statically in the manifest: everything it imports loads for every user
  at startup.
- The manifest imports from `@ynput/ayon-addon/manifest`. That entry is bundled into the addon, so
  the manifest also loads on an older AYON; contributions to slots that AYON doesn't have are
  skipped with a console warning, the rest works.
- The manifest is exposed as `./manifest` in `frontend/vite.config.ts` and listed as `"manifest"`
  in `frontend_modules` in `server/__init__.py`. The remote name (`comments`) must match in both.
- Ids: a letter, then letters, digits and `_`. Unique within their slot.

The slots, their description fields and what their code gets are typed in `SlotMap`
(`@ynput/ayon-addon`). A component passed to the wrong slot fails type-checking.

## Slot context: props and `useSlot`

The component of a contribution gets its slot's context as props:

```tsx
import type { SlotProps } from "@ynput/ayon-addon";

const CommentsProjectPage = ({ projectName }: SlotProps<"project.page">) => { ... };
```

Components further down read it with `useSlot`, always naming the slot (or several):

```tsx
import { useSlot } from "@ynput/ayon-addon";

const { projectName, slicer } = useSlot("project.page");
```

`useSlot` throws when the component is rendered in another slot, naming both. The context only
holds what depends on where you are (the project, the slicer selection, the selected projects).
Everything else is a normal import from `@ynput/ayon-addon`: `useUser`, `useNavigate` and the other
router hooks, `toast`, the layout components. Don't import `react-router-dom` or `react-toastify`
directly; data comes from `@ynput/ayon-frontend-shared/api`.

## What this addon contributes

| Slot | File | What |
|---|---|---|
| `project.page` | `src/pages/CommentsProjectPage.tsx` | Comments tab of a project: `ProjectPageLayout` with AYON's `Slicer`, the feed filtered by `useSlot('project.page').slicer` and the project's folders from `projectFolders`; the sort order is saved in the page's view (`viewType`, `views`, `src/pages/useViewSort.ts`) |
| `studio.page` | `src/pages/CommentsStudioPage.tsx` | Comments tab of the dashboard (`access: "manager"`): `StudioPageLayout` with AYON's `ProjectList`, filtered by `selectedProjects`; the sort order is saved in the page's view, as on the project page |
| `header.item` | `src/header/CommentsDialog.tsx` | Comments button next to Home (`dialog`): AYON draws the button and opens its dialog around this content, which gets `close` |
| `detailsPanel.tab` | `src/panel/CommentsTab.tsx` | Comments tab of the details panel, for folders, tasks and versions: the comments on the open `entities` |
| `detailsPanel.menuItem`, `entityMenuItem` | `src/menu/copyCommentLink.ts` | "Copy comment link" as a button in the details panel header (`pinned`) and at the top of the tables' right-click menu (`position: "top"`); one `run` function for both, told apart by `ctx.slot` |
| `projectList.menuItem` | `src/menu/copyProjectCommentsLink.ts` | "Copy comments page link" for the selected projects, in the project list's right-click menu and dropdown (`in`) |
| `slicer.menuItem` | `src/menu/copyFolderCommentLinks.ts` | "Copy comment link" for the selected folders, in the slicer's right-click menu and dropdown, hierarchy only (`sliceTypes`) |
| `projectTable.toolbarItem` | `src/toolbar/CommentsToolbarDialog.tsx`, `src/toolbar/commentLinksMenu.ts` | Comments button in the Overview, Products and Lists toolbars (`dialog`, gets `list` on Lists), and a comment links button (`menu`: the items, AYON shows them in its menu); AYON draws both before Customize |
| `projectTable.customizeSection` | `src/customize/CommentsCustomizeSection.tsx` | Comments section in the tables' Customize panel: the feeds' sort order, in the addon's slice of the AYON store; loads when opened |
| `tableColumn` | `src/table/CommentCountCell.tsx`, `src/table/useCommentCounts.ts` | Comment count column in the Overview, Products and Lists tables: `useData` runs once per table for the rows on screen, each cell gets its `value` |

AYON owns the state of the slicer and the project list (saved per page, like its own pages); the
page only decides where they go.

## Rules

- **`@ynput/ayon-addon` is listed in the federation `shared` with `import: false`**
  (by `ayonAddon()` in `frontend/vite.config.ts`). The addon never bundles a copy: inside AYON it always uses AYON's,
  so there is one slot registry. The other shared packages (React, the store, the api, the
  contexts) are AYON's too, see the README.
- Prefix endpoint and slice names with the addon name: every addon shares AYON's api and store.
- A crash in a contribution stays in its own area: AYON wraps each one in an error boundary.
  Test it: `localStorage.setItem("addon-full-template:throw", "project.comments")` makes that
  component throw (`src/testing.ts`; ids are `<area>.<id>`, `*` for all).

## Working on it

| | |
|---|---|
| `yarn dev` | Inside AYON: watched build served for AYON's dev override; open the URL it prints (developer mode) |
| `yarn dev:standalone` | The dev shell at http://localhost:5174: AYON's details panel, slicer and Customize panel around the contributions, stand-ins (marked *approximated*) for the header, page tabs, project list and table; a developer panel to pick the contribution, project and entities. Hot reload |
| `yarn ayon-addon open <slot> <id> --project <p> [--entities task:<id>] [--run] [--screenshot f] --json` | One contribution in the dev shell, headless, against the server: errors, toasts, its context, the clipboard after `--run` |
| `yarn ayon-addon preview <slot> <id> --fixture <name> --json` | The same from `frontend/dev/fixtures/<name>.json`, no server |
| `yarn ayon-addon check --json` | The manifest as AYON reads it, the pieces' files, the types |
| `yarn ayon-addon slots` | The slots of the installed `@ynput/ayon-addon` |

Sign-in: `AYON_SERVER_URL` and `AYON_API_KEY` (a service user), or the AYON login page in the dev shell. In the AYON dev workbench the local stack and its key are found on their own. Details: `node_modules/@ynput/ayon-addon-dev/AGENTS.md`; the slots and their contexts: `node_modules/@ynput/ayon-addon/AGENTS.md`.

The fixtures in `frontend/dev/fixtures` are made-up demo data: `open --save-fixture` records real server data, which must not be committed as it is.

## Developing without a published SDK

`@ynput/ayon-addon` is not on npm yet. `frontend/package.json` links it from an ayon-frontend
checkout through `frontend/.ayon-frontend` (gitignored):

```bash
# in ayon-frontend
yarn build:addon
# in frontend/
yarn link-frontend <path-to-ayon-frontend>
yarn install
yarn build
```

The dev shell also needs the ayon-frontend checkout's `@ynput/ayon-frontend-shared` (the
published 0.7.0 has no login page and no slots): `yarn build:shared` there, then
`yarn copy-shared .ayon-frontend` here. `yarn install --force` goes back to the published one.

`main` keeps the old way (keyword-named modules such as `CommentsProject`, untyped props): it is
the check that addons built that way keep working. This branch merges into `main` once an AYON
release has the slots.
