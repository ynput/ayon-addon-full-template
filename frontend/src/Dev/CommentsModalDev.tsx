import CommentsDialog from "@/header/CommentsDialog";
import { Button } from "@ynput/ayon-react-components";
import { FC, useState } from "react";

// dev server only: the header button AYON draws for the header.item contribution
const CommentsModalDev: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 20 }}>
      <Button icon="chat" onClick={() => setOpen(true)}>
        Comments
      </Button>
      <CommentsDialog
        slot="header.item"
        projectName={null}
        open={open}
        onClose={() => setOpen(false)}
        anchor={null}
      />
    </div>
  );
};

export default CommentsModalDev;
