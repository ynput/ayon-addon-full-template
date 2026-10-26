// file mimics ayon-frontend structure for development purposes only
// (the store and app level providers come from main.tsx)

import CommentsStudioPage from "@/pages/CommentsStudioPage";
import { FC } from "react";
import { WithViews } from "./WithViews";

const CommentsStudioDev: FC = () => (
  <WithViews>
    <CommentsStudioPage slot="studio.page" selectedProjects={[]} />
  </WithViews>
);

export default CommentsStudioDev;
