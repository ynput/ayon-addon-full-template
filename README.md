# AYON Addon Full Template

This template provides a comprehensive starting point for creating AYON addons with a React-based frontend. It demonstrates how to integrate custom UI components into the AYON web application using Module Federation and the AYON Shared Library.

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

### 3. Development

Start the development server:

```bash
yarn dev
```

This will start Vite.

---

## AYON Integration Modes

There are three primary ways to add a frontend component to AYON. The host application uses specific naming conventions in the **Remote Name** to determine where to place your component.

### 1. Studio

**Keyword: `Studio`**
These components appear at the studio level, typically on the home page or main dashboard. They are useful for global tools that aren't tied to a specific project (e.g., global stats, studio-wide management).

### 2. Project

**Keyword: `Project`**
These components appear within the context of a specific project. When a user navigates into a project, these tools become available in the sidebar or project tabs. They receive project-specific context (like `projectName`).

### 3. App

**Keyword: `App`** (or Modal)
These are headless or injected components. The code for these is loaded regardless of the current page, allowing you to inject UI into global parts of AYON, such as the navigation bar, or to trigger global modals.

---

## Development & Data Fetching

### Shared Library API

We use `@ynput/ayon-frontend-shared` to speed up development. This library exports a pre-configured `api` (built on Redux Toolkit Query) that contains all standard AYON endpoints.

**Crucial**: You should rarely need to write your own fetch requests with URLs. Most AYON functionality (projects, folders, tasks, etc.) is already exposed through the shared library. This ensures consistent credentials, error handling, and caching across the whole app.

### Using the AYON store

This needs AYON server 1.17.0 or newer, which is set in [package.py](package.py). Older servers don't share these packages, and the addon fails there without the providers. Inside AYON your addon has no store of its own. AYON provides `@ynput/ayon-frontend-shared`, `@reduxjs/toolkit` and `react-redux` to the addon through module federation. They are listed under `shared` in [frontend/vite.config.ts](frontend/vite.config.ts). So the addon uses AYON's own instances:

- **One cache.** Queries from `@ynput/ayon-frontend-shared/api` read and write AYON's cache. A query AYON has already run is not requested again. When AYON invalidates a tag, your queries that provide it refetch, and the same works the other way. The comments query provides AYON's `activity` tag, so the feed updates when someone comments in the details panel.
- **Your endpoints.** `api.injectEndpoints(...)` and `api.enhanceEndpoints({ addTagTypes })` add to AYON's api. Every addon shares that api, so **prefix endpoint names with your addon name**. An endpoint whose name is already taken is skipped, and your hook then calls the existing endpoint instead (see [frontend/src/App/api/getFolders.ts](frontend/src/App/api/getFolders.ts)).
- **Your state.** Inject slices into AYON's root reducer with `slice.injectInto(rootReducer)`, and add middleware with `addMiddleware`. Both come from `@ynput/ayon-frontend-shared/api`. The state lives in AYON's store, so it survives your page unmounting. See [frontend/src/App/client/store.ts](frontend/src/App/client/store.ts) and [commentsSlice.ts](frontend/src/App/client/commentsSlice.ts). Prefix slice names with your addon name too.
- **No providers.** AYON renders your modules inside its Redux `Provider`, `GlobalProvider` and `PowerpackProvider`. Project modules also get the project providers (`ProjectContext`, `ProjectFoldersContext`, the slicer and views). Hooks like `useGlobalContext()` and `useProjectFoldersContext()` work without wrapping them again. Only add a provider AYON doesn't render, like `AddonProjectProvider`.

Share **every** entry of `@ynput/ayon-frontend-shared`. An entry you leave out is bundled into your addon with its own copy of the api and contexts. The vite config reads the entries from the installed package, so this happens automatically.

The dev server has no AYON around it. There [frontend/src/main.tsx](frontend/src/main.tsx) creates a store with `createStandaloneStore()` ([frontend/src/Dev/devStore.ts](frontend/src/Dev/devStore.ts)), and the `src/Dev` pages add the providers AYON would give the modules.

Your addon uses the shared library version that the AYON server it runs on ships. If you use something new from `@ynput/ayon-frontend-shared`, raise your addon's minimum AYON version too.

### Custom GraphQL

While the shared library covers standard REST endpoints, this template also shows how to add **custom GraphQL queries** for specialized data requirements (see [frontend/src/App/api/getComments.ts](frontend/src/App/api/getComments.ts)). We use `graphql-codegen` to automatically generate TypeScript types and RTK Query hooks for your queries.

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

---

## Configuration

To make your addon visible to AYON, you must register it in two places:

### 1. Vite Configuration

In [frontend/vite.config.ts](frontend/vite.config.ts), you define which components are "exposed" as remotes. The keys in the `exposes` object are the paths AYON will look for.

```typescript
// Example from vite.config.ts
exposes: {
  "./CommentsProject": "./src/Remotes/CommentsProjectRemote.tsx",
  "./CommentsStudio": "./src/Remotes/CommentsStudioRemote.tsx",
  "./CommentsModalApp": "./src/Remotes/CommentsModalRemote.tsx",
}
```

### 2. Server Addon Declaration

In [server/**init**.py](server/__init__.py), you must tell the AYON server about your frontend modules so it knows to request them from the browser.

```python
# Example from server/__init__.py
frontend_modules = {
    "comments": [
        "CommentsProject",
        "CommentsStudio",
        "CommentsModalApp",
    ],
}
```

The module name (e.g., `"comments"`) must match the `name` defined in your `federation` config in Vite.
