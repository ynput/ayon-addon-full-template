// hoc to wrap components with views context
import { useAppDispatch } from "@/App/client/hooks";
import { Views, ViewsProvider } from "@ynput/ayon-frontend-shared/Views";
import { FC } from "react";

interface WithViewsProps {
  children: React.ReactNode;
  viewType?: string;
  projectName?: string;
}

export const WithViews: FC<WithViewsProps> = ({
  children,
  viewType,
  projectName,
}) => {
  const dispatch = useAppDispatch();
  return (
    <ViewsProvider
      viewType={viewType}
      projectName={projectName}
      dispatch={dispatch}
    >
      <Views />
      {children}
    </ViewsProvider>
  );
};
