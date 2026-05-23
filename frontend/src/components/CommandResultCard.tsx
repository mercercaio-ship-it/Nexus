// CreativEdge Phase 6-C - inline result card for slash commands.
//
// Used for read-only command results: /backup status, /compact status,
// /compact preview. Mutation results (/remember, /forget) are
// surfaced via the modal instead. The card sits in a floating-result
// area above the composer; the dismiss `×` clears it.

import { StatusBadge } from "./StatusBadge";

interface Props {
  title: string;
  variant: "ok" | "warn" | "err";
  body: React.ReactNode;
  onDismiss: () => void;
}

export function CommandResultCard({
  title,
  variant,
  body,
  onDismiss,
}: Props): JSX.Element {
  return (
    <div
      className={`ce-cmd-result ce-cmd-result-${variant}`}
      role={variant === "err" ? "alert" : "status"}
      aria-live="polite"
    >
      <div className="ce-cmd-result-head">
        <StatusBadge variant={variant === "err" ? "danger" : variant}>
          {title}
        </StatusBadge>
        <button
          type="button"
          className="ce-cmd-result-close"
          onClick={onDismiss}
          aria-label="Dismiss command result"
          title="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="ce-cmd-result-body">{body}</div>
    </div>
  );
}
