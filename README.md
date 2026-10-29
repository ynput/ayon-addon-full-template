# AYON Addon Full Template

This template provides a comprehensive starting point for creating AYON addons with a React-based frontend. It is a small production tracking toolkit with a contribution in every slot of the AYON web application, each one something a producer or artist would use where it appears: Comments pages, a My deadlines button in the header, a Shot specs tab in the details panel, status summaries, due date and export actions in the menus, a status breakdown and an Export menu in the table toolbars, a Due in column with its setting in Customize, and keyboard shortcuts on table cells. It works through `@ynput/ayon-addon`, and uses the AYON Shared Library for data and components. [AGENTS.md](AGENTS.md) lists what goes where.

## Features

- **React & Vite**: Modern frontend development with fast HMR.
- **Module Federation**: Seamlessly inject your addon's UI into the primary AYON application.
- **AYON Shared Library**: Easy access to AYON's design system, pre-built components, and centralized API endpoints.
- **Redux Toolkit & RTK Query**: Efficient state management and data fetching.
- **GraphQL**: Support for custom GraphQL queries with automatic type generation.

## Getting Started

### 1. Prerequisites

- **Node.js**: Install the latest stable version from [nodejs.org](https://nodejs.org/).
- **Yarn**: Once Node.js is installed, open your terminal and run:
  ```bash
  npm install --global yarn
  ```

### 2. Installation

Navigate to the `frontend` folder and install the dependencies:

```bash
cd frontend
yarn install
```

`@ynput/ayon-addon` and `@ynput/ayon-addon-dev` aren't published yet: link them from an ayon-frontend checkout first, see [Developing without a published SDK](AGENTS.md#developing-without-a-published-sdk).

### 3. Development

There are three ways to see the addon while you work on it:

```bash
yarn dev              # without AYON: the dev shell at http://localhost:5174, hot reload
yarn dev:ayon         # inside AYON: rebuilds on every change, open the AYON URL it prints
yarn ayon-addon preview detailsPanel.tab specs --fixture panel-shot-specs   # no server at all
```

- **Inside AYON** (`yarn dev:ayon`): AYON loads this addon from your machine instead of the installed version (`?addonDev=addon-full-template@http://localhost:5173`, developer mode). The page reloads after each rebuild.
- **Dev shell** (`yarn dev`): the addon's contributions in AYON's own details panel, slicer and Customize panel, with stand-ins for the header and tables, and a developer panel to pick the contribution and its context (project, entities). It signs in with the AYON login, or with `AYON_API_KEY`.
- **Preview**: one contribution with the data in [frontend/dev/fixtures](frontend/dev/fixtures), no server needed.

`yarn ayon-addon open <slot> <id>` and `yarn ayon-addon preview` render one contribution in a headless browser and report errors, toasts and the context it got (`--json`, `--screenshot`), for scripts and coding agents. `yarn ayon-addon check` checks the manifest. All commands: `node_modules/@ynput/ayon-addon-dev/AGENTS.md`.

---

## Where the frontend goes: slots

AYON has named places in its UI, **slots**: `project.page`, `studio.page`, `header.item`, `detailsPanel.tab`, menu items, `tableColumn`, toolbar items and Customize sections. The addon lists what it puts where in one module, [frontend/src/manifest.ts](frontend/src/manifest.ts); AYON reads it at startup and loads each component when its slot needs it. Each component gets its slot's context as typed props (`SlotProps<'detailsPanel.tab'>`). See [AGENTS.md](AGENTS.md), and `node_modules/@ynput/ayon-addon/AGENTS.md` for every slot.

AYON versions without slots load addons by keyword-named modules (`CommentsProject`, `CommentsStudio`, `CommentsModalApp`): that is the `main` branch of this template.

---

## Development & Data Fetching

### Shared Library API

We use `@ynput/ayon-frontend-shared` to speed up development. This library exports a pre-configured `api` (built on Redux Toolkit Query) that contains all standard AYON endpoints.

**Crucial**: You should rarely need to write your own fetch requests with URLs. Most AYON functionality (projects, folders, tasks, etc.) is already exposed through the shared library. This ensures consistent credentials, error handling, and caching across the whole app.

### Using the AYON store

This needs AYON server 1.17.0 or newer, which is set in [package.py](package.py). Older servers don't share these packages, and the addon fails there without the providers. Inside AYON your addon has no store of its own. AYON provides `@ynput/ayon-frontend-shared`, `@reduxjs/toolkit` and `react-redux` to the addon through module federation. They are listed under `shared` in [frontend/vite.config.ts](frontend/vite.config.ts). So the addon uses AYON's own instances:

- **One cache.** Queries from `@ynput/ayon-frontend-shared/api` read and write AYON's cache. A query AYON has already run is not requested again. When AYON invalidates a tag, your queries that provide it refetch, and the same works the other way. The comments query provides AYON's `activity` tag, so the feed updates when someone comments in the details panel; the production queries provide `entityActivities`, so the Shot specs tab updates when a frame range changes anywhere.
- **Your endpoints.** `api.injectEndpoints(...)` and `api.enhanceEndpoints({ addTagTypes })` add to AYON's api. Every addon shares that api, so **prefix endpoint names with your addon name**. An endpoint whose name is already taken is skipped, and your hook then calls the existing endpoint instead (see [frontend/src/App/api/getFolders.ts](frontend/src/App/api/getFolders.ts)).
- **Your state.** Inject slices into AYON's root reducer with `slice.injectInto(rootReducer)`, and add middleware with `addMiddleware`. Both come from `@ynput/ayon-frontend-shared/api`. The state lives in AYON's store, so it survives your page unmounting. See [frontend/src/App/client/store.ts](frontend/src/App/client/store.ts) and [productionSlice.ts](frontend/src/App/client/productionSlice.ts). Prefix slice names with your addon name too.
- **Outside React.** Menu items' `run` and toolbar `menu` pieces are plain functions, so they can't call hooks. They import `dispatch` from `@ynput/ayon-addon` (AYON's store) and run the same endpoints: `await dispatch(api.endpoints.x.initiate(args)).unwrap()`. See [frontend/src/App/api/production.ts](frontend/src/App/api/production.ts) and [pushDueDate.ts](frontend/src/menu/pushDueDate.ts), which writes through AYON's own `updateEntities`.
- **No providers.** AYON renders your modules inside its Redux `Provider`, `GlobalProvider` and `PowerpackProvider`. Project modules also get the project providers (`ProjectContext`, `ProjectFoldersContext`, the slicer and views). Hooks like `useGlobalContext()` and `useProjectFoldersContext()` work without wrapping them again. Only add a provider AYON doesn't render, like `AddonProjectProvider`.

Share **every** entry of `@ynput/ayon-frontend-shared`. An entry you leave out is bundled into your addon with its own copy of the api and contexts. The vite config reads the entries from the installed package, so this happens automatically.

Without AYON (`yarn dev`) the dev shell from `@ynput/ayon-addon-dev` creates a store with `createStandaloneStore()` and renders AYON's providers around the addon, so the addon itself has no dev-only code.

Your addon uses the shared library version that the AYON server it runs on ships. If you use something new from `@ynput/ayon-frontend-shared`, raise your addon's minimum AYON version too.

### Testing with a local ayon-frontend

To build the addon against unreleased changes to `@ynput/ayon-frontend-shared`, build shared in your ayon-frontend checkout and copy it into the addon:

```bash
# in ayon-frontend
yarn build:shared

# in frontend/
yarn copy-shared ../../ayon-frontend
yarn build
```

Run `yarn copy-shared` again after every shared build. `yarn install --force` goes back to the published package.

**Don't use `yarn link` for this.** The addon builds, but it crashes inside AYON with errors like `TypeError: N is not a function`. The module federation vite plugin resolves shared packages to their real path, and a linked package's real path is outside `node_modules`. The plugin then treats it as a local workspace package: it bundles the package's own code into the chunk that loads AYON's copy, so that code runs when the chunk loads, before AYON's `react/jsx-runtime` is wired in. A copy in `node_modules` builds like the published package. [frontend/scripts/copyShared.js](frontend/scripts/copyShared.js) does the copy.

### Custom GraphQL

While the shared library covers standard REST endpoints, this template also shows how to add **custom GraphQL queries** for specialized data requirements (see [frontend/src/App/api/getComments.ts](frontend/src/App/api/getComments.ts) and [production.ts](frontend/src/App/api/production.ts)). From AYON 1.17 `attrib` is a JSON object: select it whole, or pick attributes with `attrib(names: ["endDate"])`. We use `graphql-codegen` to automatically generate TypeScript types and RTK Query hooks for your queries.

#### Generating GraphQL Types

1. **Create your query**: Add a `.graphql` file anywhere in [frontend/src](frontend/src) (e.g., [frontend/src/App/api/graphql/GetComments.graphql](frontend/src/App/api/graphql/GetComments.graphql)).
2. **Setup Credentials**: Create a `.env.local` file in the `frontend` directory with your AYON credentials:
   ```env
   NAME=your_username
   PASSWORD=your_password
   ```
3. **Get Auth Token**: Run the following command to fetch a fresh token from your local server (make sure AYON and the Dev server are running):
   ```bash
   yarn generate-token
   ```
4. **Generate Code**: Run the codegen script:
   ```bash
   yarn generate-gql
   ```

This will update [frontend/src/App/api/generated/graphql.ts](frontend/src/App/api/generated/graphql.ts) with new hooks like `useGetCommentsQuery` which you can then import and use in your components.

### The addon's own REST endpoints

When the addon's server adds endpoints, `yarn generate-rest` (`ayon-addon generate-rest`) generates their RTK Query endpoints and types from the addon's OpenAPI schema. Install the addon in this version on your server first, then run it in `frontend/`:

- `src/api/generated/<name>.ts` holds the endpoints, injected into AYON's api and prefixed with the addon name. Never edit it.
- `src/api/<name>.ts` is created on the first run. Add cache tags and optimistic updates there; it exports the hooks. Later runs offer to export the hooks of new endpoints.

POST endpoints that only read go in `ayonAddon({ rest: { queries: [...] } })` in `vite.config.ts`. Details: `node_modules/@ynput/ayon-addon-dev/AGENTS.md`.

---

## Configuration

To make your addon visible to AYON, you must register it in two places:

### 1. Vite Configuration

[frontend/vite.config.ts](frontend/vite.config.ts) uses `ayonAddon()` from `@ynput/ayon-addon-dev`. It sets up module federation the way AYON loads addons: the remote `production`, `./manifest` exposed, and everything AYON provides shared.

```typescript
// vite.config.ts
plugins: [react(), ayonAddon({ name: "production" })],
```

### 2. Server Addon Declaration

In [server/**init**.py](server/__init__.py), you must tell the AYON server about your frontend modules so it knows to request them from the browser.

```python
# server/__init__.py
frontend_modules = {"production": ["manifest"]}
```

The module name (`"production"`) must match the `name` given to `ayonAddon()`.
