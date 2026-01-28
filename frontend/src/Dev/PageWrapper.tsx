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

const PageWrapper = ({ children }: PageWrapperProps) => {
  return <Page className="page-wrapper">{children as any}</Page>;
};

export default PageWrapper;
