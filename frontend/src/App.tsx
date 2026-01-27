// This is only used in development mode and not the exported addon bundle

import { useState } from "react";
import { Button, Toolbar } from "@ynput/ayon-react-components";
type Widget = "studio" | "project" | "modal";

function App() {
  const [widget, setWidget] = useState<Widget>("studio");

  return (
    <Toolbar>
      {["studio", "project", "modal"].map((w) => (
        <Button
          key={w}
          selected={widget === w}
          onClick={() => setWidget(w as Widget)}
        >
          {w}
        </Button>
      ))}
    </Toolbar>
  );
}

export default App;
