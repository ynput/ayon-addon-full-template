import { RemoteAppProps } from "@/Main/CommentsModalMain";
import CommentsModalRemote from "@/Remotes/CommentsModalRemote";
import { FC } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const MockNav = styled.nav`
  background-color: var(--md-sys-color-surface-container-high);
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 50px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
`;

const CommentsModalDev: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const componentProps: RemoteAppProps = {
    // add any required props for the remote component here
    name: "Comments Modal Dev",
    version: "1.0.0",
    location: location,
    searchParams: searchParams,
    setSearchParams: setSearchParams,
    navigate: navigate,
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* This mock nav structure matches what CommentsModalMain expects */}
      <MockNav className="primary">
        <div style={{ display: "flex", gap: 8 }}>
          <span>Mock Nav Bar: </span>
        </div>
      </MockNav>

      <div style={{ flex: 1, padding: 20 }}>
        <h2>Modal App Dev Preview</h2>
        <p>
          The button above should have been portaled into the "Mock Nav Bar"
          section.
        </p>
        {/* Render the remote component */}
        <CommentsModalRemote {...componentProps} />
      </div>
    </div>
  );
};

export default CommentsModalDev;
