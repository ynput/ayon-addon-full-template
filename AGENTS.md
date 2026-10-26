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
| `project.page` | `src/pages/CommentsProjectPage.tsx` | Comments tab of a project: `ProjectPageLayout` with AYON's `Slicer`, the feed filtered by `useSlot('project.page').slicer` |
| `studio.page` | `src/pages/CommentsStudioPage.tsx` | Comments tab of the dashboard (`access: "manager"`): `StudioPageLayout` with AYON's `ProjectList`, filtered by `selectedProjects` |
| `header.item` | `src/header/CommentsDialog.tsx` | Comments button next to Home; AYON draws the button, the dialog gets `open` / `onClose` |

AYON owns the state of the slicer and the project list (saved per page, like its own pages); the
page only decides where they go.

## Rules

- **`@ynput/ayon-addon` is listed in the federation `shared` with `import: false`**
  (`frontend/vite.config.ts`). The addon never bundles a copy: inside AYON it always uses AYON's,
  so there is one slot registry. The other shared packages (React, the store, the api, the
  contexts) are AYON's too, see the README.
- Prefix endpoint and slice names with the addon name: every addon shares AYON's api and store.
- A crash in a contribution stays in its own area: AYON wraps each one in an error boundary.
  Test it: `localStorage.setItem("addon-full-template:throw", "project.comments")` makes that
  component throw (`src/testing.ts`; ids are `<area>.<id>`, `*` for all).

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

`main` keeps the old way (keyword-named modules such as `CommentsProject`, untyped props): it is
the check that addons built that way keep working. This branch merges into `main` once an AYON
release has the slots.
