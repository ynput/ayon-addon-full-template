import CommentsProjectMain from "@/Main/CommentsProjectMain";
import { RemoteAddonProject } from "@ynput/ayon-frontend-shared/context";

const commentsProjectRemote: RemoteAddonProject = {
  component: CommentsProjectMain,
  id: "comments", // unique id for the addon project remote
  module: "comments", // URL path to the addon module
  name: "Comments", // Name shown in the UI
  viewType: "project-comments", // optionally specify viewType for views support
  slicer: {
    fields: ["hierarchy"],
  },
};

export default commentsProjectRemote;
