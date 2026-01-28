// This is only used in development mode and not the exported addon bundle

import { Button, Toolbar } from "@ynput/ayon-react-components";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import CommentsProjectDev from "./Dev/CommentsProjectDev";
import CommentsStudioDev from "./Dev/CommentsStudioDev";
import CommentsModalDev from "./Dev/CommentsModalDev";

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const routes = [
    { name: "studio", path: "/studio", component: <CommentsStudioDev /> },
    { name: "project", path: "/project", component: <CommentsProjectDev /> },
    { name: "modal", path: "/modal", component: <CommentsModalDev /> },
  ];

  return (
    <>
      <Toolbar>
        {routes.map((w) => (
          <Button
            key={w.name}
            selected={pathname === w.path}
            onClick={() => navigate(w.path)}
          >
            {w.name}
          </Button>
        ))}
      </Toolbar>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/studio" replace />} />
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Routes>
      </main>
    </>
  );
}

export default App;
