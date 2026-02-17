import { useId, useRef } from "react";
import { useAccessibleDialog } from "../../common/useAccessibleDialog";

type PlayerProfile = {
  name: string;
  uuid: string;
  isOp: boolean;
  isWhitelisted: boolean;
  isBanned: boolean;
  lastSeenAt: string | null;
  lastActionAt: string | null;
};

type PlayerProfileModalProps = {
  visible: boolean;
  profile: PlayerProfile | null;
  runningAction: string | null;
  banReason: string;
  onBanReasonChange: (value: string) => void;
  onClose: () => void;
  onRunAction: (action: "op" | "deop" | "whitelist" | "unwhitelist" | "ban" | "unban") => void;
};

export function PlayerProfileModal(props: PlayerProfileModalProps) {
  const { visible, profile, runningAction, banReason, onBanReasonChange, onClose, onRunAction } = props;
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const headingId = useId();
  const descriptionId = useId();
  const { onBackdropClick } = useAccessibleDialog({
    open: visible && profile !== null,
    dialogRef,
    initialFocusRef: closeButtonRef,
    onRequestClose: onClose
  });
  if (!visible || !profile) {
    return null;
  }

  return (
    <section className="v2-modal-backdrop" role="presentation" onClick={onBackdropClick}>
      <article
        ref={dialogRef}
        className="panel v2-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <header className="v2-modal-header">
          <div>
            <h3 id={headingId}>{profile.name}</h3>
            <p id={descriptionId} className="muted-note">
              {profile.uuid}
            </p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close player profile">
            Close
          </button>
        </header>

        <div className="inline-actions">
          {profile.isOp ? <span className="status-pill tone-neutral">Operator</span> : null}
          {profile.isWhitelisted ? <span className="status-pill tone-ok">Whitelisted</span> : null}
          {profile.isBanned ? <span className="status-pill tone-warn">Banned</span> : null}
        </div>

        <ul className="list list-compact">
          <li>
            <div>
              <strong>Last Seen</strong>
              <span>{profile.lastSeenAt ? new Date(profile.lastSeenAt).toLocaleString() : "Unknown"}</span>
            </div>
          </li>
          <li>
            <div>
              <strong>Last Admin Action</strong>
              <span>{profile.lastActionAt ? new Date(profile.lastActionAt).toLocaleString() : "Unknown"}</span>
            </div>
          </li>
        </ul>

        <label>
          Ban Reason (optional)
          <input value={banReason} onChange={(event) => onBanReasonChange(event.target.value)} placeholder="Rule violation" />
        </label>

        <div className="inline-actions v2-modal-actions">
          <button type="button" onClick={() => onRunAction("op")} disabled={runningAction !== null || profile.isOp}>
            Op
          </button>
          <button type="button" onClick={() => onRunAction("deop")} disabled={runningAction !== null || !profile.isOp}>
            Deop
          </button>
          <button type="button" onClick={() => onRunAction("whitelist")} disabled={runningAction !== null || profile.isWhitelisted}>
            Whitelist
          </button>
          <button type="button" onClick={() => onRunAction("unwhitelist")} disabled={runningAction !== null || !profile.isWhitelisted}>
            Un-whitelist
          </button>
          <button type="button" onClick={() => onRunAction("ban")} disabled={runningAction !== null || profile.isBanned}>
            Ban
          </button>
          <button type="button" onClick={() => onRunAction("unban")} disabled={runningAction !== null || !profile.isBanned}>
            Unban
          </button>
        </div>
      </article>
    </section>
  );
}
