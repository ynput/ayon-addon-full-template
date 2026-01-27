import { FC } from "react";
import styled from "styled-components";

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`;

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: FC<PageWrapperProps> = ({ children }) => {
  return <Page className="page-wrapper">{children}</Page>;
};

export default PageWrapper;
