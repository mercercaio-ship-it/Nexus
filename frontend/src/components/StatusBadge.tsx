// CreativEdge Phase 6-B - compact status badge.
//
// Used by AgentCard, BackupPanel, MemoryToolsPanel for system-state
// pills (gitReady, repoReady, remoteConfigured, provider, decision
// type, …). Color encodes severity (`ok` / `info` / `warn` / `danger`
// / `neutral`) **and** a leading glyph is rendered so colour is not
// the sole signal. The element is purely presentational; no actions.

import type { BadgeVariant } from "../types";

interface Props {
  variant?: BadgeVariant;
  /** Visible label, e.g. "ready", "degraded", "no remote". */
  children: React.ReactNode;
  /** Optional override icon. Defaults to a per-variant glyph. */
  icon?: string;
  /** Optional title shown on hover (accessibility hint). */
  title?: string;
}

const DEFAULT_ICON: Record<BadgeVariant, string> = {
  ok: "✓",
  info: "·",
  warn: "⚠",
  danger: "✕",
  neutral: "—",
};

export function StatusBadge({
  variant = "neutral",
  children,
  icon,
  title,
}: Props): JSX.Element {
  const glyph = icon ?? DEFAULT_ICON[variant];
  return (
    <span
      className={`ce-badge ce-badge-${variant}`}
      title={title}
      role="status"
    >
      <span className="ce-badge-glyph" aria-hidden>
        {glyph}
      </span>
      <span className="ce-badge-label">{children}</span>
    </span>
  );
}
