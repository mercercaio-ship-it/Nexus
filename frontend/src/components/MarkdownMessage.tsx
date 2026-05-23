// CreativEdge Phase 6-C - safe markdown renderer for assistant content.
//
// react-markdown + remark-gfm. **No raw HTML**, **no rehype-raw**,
// **no dangerouslySetInnerHTML**. Links open in a new tab with
// `rel="noreferrer noopener"`. Code blocks render through the
// shared `CodeBlock` component (language label + copy button).
//
// Notes:
//   - We don't pass `rehypePlugins` at all, so any embedded HTML in
//     the markdown source is treated as literal text by react-markdown.
//   - User messages still render as plain pre-wrapped text via the
//     parent `MessageThread`; only assistant content goes through
//     markdown.
//   - Long words / URLs wrap via the `.ce-md` CSS (overflow-wrap:
//     anywhere). Code blocks scroll horizontally instead.

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "./CodeBlock";

interface Props {
  text: string;
}

export function MarkdownMessage({ text }: Props): JSX.Element {
  return (
    <div className="ce-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // No rehype plugins at all: keeps raw HTML literal, sidesteps
        // the entire HTML-injection class of attacks.
        components={{
          a: ({ href, children, ...rest }) => (
            <a
              href={href ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              {...rest}
            >
              {children}
            </a>
          ),
          code: ({ inline, className, children, ...rest }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          } & React.HTMLAttributes<HTMLElement>) => {
            // Strip out extra props that don't apply to our wrapper.
            void rest;
            return (
              <CodeBlock inline={inline} className={className}>
                {children}
              </CodeBlock>
            );
          },
          // GFM-enabled tables would otherwise blow the column out;
          // wrap them so overflow scrolls instead of stretching.
          table: ({ children }) => (
            <div className="ce-md-table-wrap">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
