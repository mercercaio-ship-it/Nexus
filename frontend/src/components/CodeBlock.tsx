// CreativEdge Phase 6-C - fenced code block with language label + copy.
//
// Used by `MarkdownMessage` via react-markdown's `components.code`
// override. Renders inline code with `<code>` inline, and fenced code
// with a styled block that:
//   - shows a language tag when react-markdown gave us
//     `className="language-foo"`,
//   - has a copy-to-clipboard button with a 1.5s "Copied" feedback
//     state,
//   - scrolls horizontally on overflow so long lines don't blow up
//     the layout,
//   - wraps the language label as visible text (not just colour).
//
// Phase 6-D may add syntax highlighting; this slice intentionally keeps
// the block plain to stay light on deps.

import { useCallback, useState } from "react";

interface Props {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function extractLanguage(className?: string): string | null {
  if (!className) return null;
  const m = /language-([\w+-]+)/.exec(className);
  return m ? m[1] : null;
}

function childrenToString(children: React.ReactNode): string {
  if (children == null) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) {
    return children.map(childrenToString).join("");
  }
  // For object / element children we render their text content best-
  // effort by walking React.children would be heavier; the markdown
  // pipeline almost always hands us a string here.
  return "";
}

export function CodeBlock({
  inline,
  className,
  children,
}: Props): JSX.Element {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    const text = childrenToString(children);
    if (!text || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        // Clipboard API blocked; degrade quietly.
      });
  }, [children]);

  if (inline) {
    return <code className="ce-md-inline-code">{children}</code>;
  }

  const language = extractLanguage(className);
  return (
    <div className="ce-md-codeblock">
      <div className="ce-md-codeblock-head">
        <span className="ce-md-codeblock-lang" aria-label="Code language">
          {language ?? "code"}
        </span>
        <button
          type="button"
          className="ce-md-codeblock-copy"
          onClick={onCopy}
          aria-label="Copy code to clipboard"
          title={copied ? "Copied" : "Copy"}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="ce-md-codeblock-body">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
