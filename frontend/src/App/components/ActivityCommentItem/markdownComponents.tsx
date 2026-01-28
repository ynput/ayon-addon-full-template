import { isArray } from "lodash";
import { BlockCode, QuoteLine } from "./ActivityCommentItem.styled";

interface CodeTagProps {
  node?: any;
  className?: string;
  children: React.ReactNode;
}

export const codeTag = ({ children }: CodeTagProps): JSX.Element => {
  return <BlockCode>{children as any}</BlockCode>;
};

interface BlockquoteTagProps {
  children: React.ReactNode;
}

export const blockquoteTag = ({
  children,
}: BlockquoteTagProps): JSX.Element => {
  // get children string
  const child = (children as any).find?.((item: any) => !!item?.props)?.props
    ?.children;

  if (!child) return <blockquote>{children}</blockquote>;

  // now split by new lines
  const lines: JSX.Element[] = [];
  if (typeof child === "string") {
    // split by new lines
    const stringLines = child.split("\n");
    stringLines.forEach((line, i) => {
      lines.push(<QuoteLine key={i}>{line}</QuoteLine>);
    });
  } else if (isArray(child)) {
    const splitLines: any = [];
    let index = 0;
    (child as any).forEach((line: any) => {
      // check index exists on lines otherwise make a new empty array
      if (!splitLines[index]) splitLines[index] = [];

      if (typeof line === "string") {
        // check for \n
        const stringLines = line.split(/(\n)/);

        stringLines.forEach((split) => {
          if (split === "\n") {
            index++;
            // create new array
            splitLines[index] = [];
          } else splitLines[index].push(split);
        });
      } else {
        // now add line
        splitLines[index].push(line);
      }
    });

    splitLines.forEach((line: any, i: number) => {
      lines.push(<QuoteLine key={i}>{line}</QuoteLine>);
    });
  }

  return <blockquote>{lines}</blockquote>;
};
