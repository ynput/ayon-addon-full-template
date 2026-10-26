import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import {
  GlobalProvider,
  PowerpackProvider,
} from "@ynput/ayon-frontend-shared/context";
import { ContextMenuProvider } from "@ynput/ayon-frontend-shared/ContextMenu";
import { devStore } from "./Dev/devStore";
import "./main.css";

import "@ynput/ayon-react-components/dist/style.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Dev server only: stands in for AYON, which renders every addon module inside its store and
// these app level providers.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={devStore}>
        <GlobalProvider>
          <PowerpackProvider>
            <ContextMenuProvider>
              <App />
            </ContextMenuProvider>
          </PowerpackProvider>
        </GlobalProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
