import { theme } from "@ynput/ayon-react-components";
import styled from "styled-components";

export const CommentWrapper = styled.div`
  border-radius: var(--border-radius-m);
`;

export const Comment = styled.li`
  /* VARS */
  --background-color: var(--md-sys-color-surface-container);

  /* reset default */
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  gap: var(--base-gap-small);

  width: 100%;
  padding: var(--padding-m);
  border-radius: var(--border-radius-m);

  &.isHighlighted {
    background-color: var(--md-sys-color-secondary-container);
  }
`;

export const Body = styled.div`
  background-color: var(--background-color);
  border-radius: var(--border-radius-m);
  padding: 8px;
  position: relative;

  p {
    margin: 0;
  }

  & > *:nth-child(2) {
    margin-top: 8px;
  }

  & > *:not(h1) {
    margin-bottom: 0;
  }

  a {
    color: var(--md-sys-color-primary);
  }

  img {
    width: 100%;
  }

  p {
    word-break: break-word;
    .reference {
      top: 5px;
    }
  }

  h1 {
    ${theme.titleLarge}
    font-size: 24px;
  }

  h2 {
    ${theme.titleMedium}
    font-size: 20px;
  }

  h3 {
    ${theme.titleSmall}
    font-size: 16px;
  }

  h1,
  h2,
  h3 {
    margin-top: 16px;
  }

  ul,
  ol {
    .reference {
      top: 6px;
    }
  }

  .contains-task-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--base-gap-large);
    padding-left: 8px;
    margin: 16px 0;

    li {
      align-items: center;
    }

    & > * {
      padding-left: 1.5rem;
    }

    p {
      margin: 0;

      .reference {
        top: 0px;
        margin-left: 4px;
      }
    }
  }

  blockquote {
    margin: 0;
    padding-left: 16px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: var(--md-sys-color-outline-variant);
      border-radius: 2px;
    }
  }

  /* Inline code elements (not in pre blocks) */
  code:not(pre code) {
    font-family: monospace;
    background-color: var(--md-sys-color-surface-container-lowest);
    padding: 2px 4px;
    border-radius: 2px;
  }
`;

export const QuoteLine = styled.p`
  margin: 0;

  &:first-child {
    margin-top: 14px;
  }

  &:last-child {
    margin-bottom: 14px;
  }
`;

export const BlockCode = styled.pre`
  padding: var(--padding-m);
  border-radius: var(--padding-s);
  background-color: var(--md-sys-color-surface-container-lowest);
  font-family: monospace;
  font-size: var(--md-sys-typescale-body-small-font-size);

  line-break: anywhere;
  word-break: break-word;
  overflow: hidden;

  /* Ensure all child elements use monospace font */
  * {
    font-family: monospace !important;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--base-gap-small);
`;

export const HeaderBody = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-gap-small);
  overflow: hidden;
  white-space: nowrap;

  h5 {
    margin: 0;
    font-weight: 600;
  }

  .icon {
    font-size: 22px;
    color: var(--md-sys-color-outline);
  }
`;

export const Date = styled.span`
  color: var(--md-sys-color-outline);
  font-size: var(--md-sys-typescale-body-small-font-size);
  white-space: nowrap;
`;

export const ReactionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--base-gap-small);
  margin-top: 16px;
`;

export const Reaction = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--border-radius-m);
  background-color: var(--md-sys-color-surface-container-high);
  font-size: var(--md-sys-typescale-body-small-font-size);

  .emoji {
    font-size: 14px;
  }
`;

export const FilesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--base-gap-large);
  margin-top: 8px;
`;

export const FileCard = styled.div`
  height: 80px;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-m);
  background-color: var(--md-sys-color-surface-container-high);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .icon {
    font-size: 32px;
    color: var(--md-sys-color-outline);
  }
`;

export const FileName = styled.span`
  font-size: var(--md-sys-typescale-body-small-font-size);
  color: var(--md-sys-color-outline);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  padding: 0 4px;
`;
