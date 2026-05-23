// CreativEdge Phase 6-B - safe rendering of backend `<mark>` snippets.
//
// `/sessions/search` returns snippets like:
//     "…and <mark>oi</mark> there was…"
// Phase 6-A stripped the tags to render plain text. Phase 6-B keeps the
// highlight by parsing the snippet into segments and rendering each
// `<mark>` segment as a real React `<mark>` element. **No
// dangerouslySetInnerHTML anywhere** — the snippet is split with a
// simple regex and re-assembled as text + span children, so the user
// can never inject HTML/JS via a stored message.

interface Props {
  /** Raw snippet text from the backend. May contain `<mark>…</mark>`
   *  pairs. Anything else is rendered as plain text. */
  text: string;
}

// Split into chunks that are either inside or outside `<mark>` tags.
// We deliberately accept malformed input (an unclosed `<mark>`) by
// treating any leftover text as plain content; nothing is interpreted
// as HTML.
function tokenize(text: string): Array<{ mark: boolean; value: string }> {
  const out: Array<{ mark: boolean; value: string }> = [];
  const re = /<mark>([\s\S]*?)<\/mark>/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push({ mark: false, value: text.slice(lastIndex, m.index) });
    }
    out.push({ mark: true, value: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    // Strip any stray unclosed `<mark>` / `</mark>` from leftover text.
    const tail = text.slice(lastIndex).replace(/<\/?mark>/g, "");
    if (tail.length > 0) out.push({ mark: false, value: tail });
  }
  return out;
}

export function SafeSnippet({ text }: Props): JSX.Element {
  const tokens = tokenize(text);
  return (
    <span className="ce-safe-snippet">
      {tokens.map((t, i) =>
        t.mark ? (
          <mark key={i} className="ce-mark">
            {t.value}
          </mark>
        ) : (
          <span key={i}>{t.value}</span>
        )
      )}
    </span>
  );
}
