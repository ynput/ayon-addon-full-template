import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button, Dialog } from "@ynput/ayon-react-components";
import { store } from "@/App/client/store";
import ProjectsComments from "@/App/components/ProjectsComments";
import {
  GlobalProvider,
  PowerpackProvider,
} from "@ynput/ayon-frontend-shared/context";
import { Provider } from "react-redux";
import {
  Location,
  NavigateFunction,
  SetURLSearchParams,
} from "react-router-dom";
import { Comment } from "@/App/api/getComments";

export type RemoteAppProps = {
  name: string;
  version: string;
  location: Location<any>;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  navigate: NavigateFunction;
};

const CommentsModalMain = (props: RemoteAppProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [navElement, setNavElement] = useState<Element | null>(null);

  useEffect(() => {
    // selector for the first child of the primary nav bar
    const el = document.querySelector("nav.primary > div:first-child");
    if (el) {
      // Defer state update to avoid cascading render warning in useEffect
      const timeoutId = setTimeout(() => setNavElement(el), 0);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const navigate = props.navigate;
  const handleNavigateToComment = (comment: Comment) => {
    if (!navigate) return;
    setIsOpen(false);
    // http://localhost:5000/projects/demo_Commercial/overview?project=demo_Commercial&type=folder&id=b6018ab69e0d11f08e1326663122a745&activity=c019c010fb9411f095974d95639abd27
    // Build URL using URL and URLSearchParams
    const baseUrl = `/projects/${comment.projectName}/overview`;
    const searchParams = new URLSearchParams({
      project: comment.projectName,
      type: "folder",
      id: comment.entityId as string,
      activity: comment.activityId,
    });
    navigate(`${baseUrl}?${searchParams.toString()}`);
  };

  return (
    <Provider store={store}>
      <GlobalProvider>
        <PowerpackProvider>
          {navElement &&
            (createPortal(
              <Button
                icon="chat"
                onClick={() => setIsOpen(true)}
                variant="nav"
                className="nav"
              >
                Comments
              </Button>,
              navElement,
            ) as any)}
          <Dialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            header="Project Comments"
            size="lg"
          >
            <div
              style={{
                height: "600px",
                maxHeight: "80vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <ProjectsComments onCommentSelect={handleNavigateToComment} />
            </div>
          </Dialog>
        </PowerpackProvider>
      </GlobalProvider>
    </Provider>
  );
};

export default CommentsModalMain;
