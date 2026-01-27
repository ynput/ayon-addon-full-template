import CommentsStudioMain from "@/Main/CommentsStudioMain";

const commentsProjectRemote = {
  component: CommentsStudioMain,
  id: "comments", // unique id for the addon project remote
  module: "comments", // URL path to the addon module
  name: "Comments", // Name shown in the UI
  viewType: "studio-comments", // optionally specify viewType for views support
};

export default commentsProjectRemote;
