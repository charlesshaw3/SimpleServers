type PlayerAdminState = {
  ops: Array<{ uuid: string; name: string; level: number; bypassesPlayerLimit: boolean }>;
  whitelist: Array<{ uuid: string; name: string }>;
  bannedPlayers: Array<{ uuid: string; name: string; reason: string }>;
  bannedIps: Array<{ ip: string; reason: string }>;
  knownPlayers: Array<{ name: string; uuid: string }>;
  history: Array<{ ts: string; kind: string; subject: string; detail: string; source: "admin" | "runtime" }>;
};

type PlayersTabProps = {
  state: PlayerAdminState | null;
  playerActionName: string;
  playerActionUuid: string;
  playerBanReason: string;
  playerIpInput: string;
  runningPlayerAction: string | null;
  onSetPlayerActionName: (value: string) => void;
  onSetPlayerActionUuid: (value: string) => void;
  onSetPlayerBanReason: (value: string) => void;
  onSetPlayerIpInput: (value: string) => void;
  onAddOp: () => void;
  onRemoveOp: () => void;
  onAddWhitelist: () => void;
  onRemoveWhitelist: () => void;
  onBanPlayer: () => void;
  onUnbanPlayer: () => void;
  onBanIp: () => void;
  onUnbanIp: () => void;
};

export function PlayersTab(props: PlayersTabProps) {
  const {
    state,
    playerActionName,
    playerActionUuid,
    playerBanReason,
    playerIpInput,
    runningPlayerAction,
    onSetPlayerActionName,
    onSetPlayerActionUuid,
    onSetPlayerBanReason,
    onSetPlayerIpInput,
    onAddOp,
    onRemoveOp,
    onAddWhitelist,
    onRemoveWhitelist,
    onBanPlayer,
    onUnbanPlayer,
    onBanIp,
    onUnbanIp
  } = props;

  return (
    <section className="v2-players-tab">
      <article className="panel">
        <h3>Player Administration</h3>
        <div className="grid-form">
          <label>
            Player Name
            <input value={playerActionName} onChange={(event) => onSetPlayerActionName(event.target.value)} placeholder="PlayerName" />
          </label>
          <label>
            UUID (optional)
            <input value={playerActionUuid} onChange={(event) => onSetPlayerActionUuid(event.target.value)} placeholder="uuid..." />
          </label>
          <label>
            Reason (optional)
            <input value={playerBanReason} onChange={(event) => onSetPlayerBanReason(event.target.value)} placeholder="Rule violation" />
          </label>
          <label>
            IP
            <input value={playerIpInput} onChange={(event) => onSetPlayerIpInput(event.target.value)} placeholder="1.2.3.4" />
          </label>
        </div>
        <div className="inline-actions">
          <button type="button" onClick={onAddOp} disabled={runningPlayerAction !== null}>
            Op +
          </button>
          <button type="button" onClick={onRemoveOp} disabled={runningPlayerAction !== null}>
            Op -
          </button>
          <button type="button" onClick={onAddWhitelist} disabled={runningPlayerAction !== null}>
            Whitelist +
          </button>
          <button type="button" onClick={onRemoveWhitelist} disabled={runningPlayerAction !== null}>
            Whitelist -
          </button>
          <button type="button" onClick={onBanPlayer} disabled={runningPlayerAction !== null}>
            Ban Player
          </button>
          <button type="button" onClick={onUnbanPlayer} disabled={runningPlayerAction !== null}>
            Unban Player
          </button>
          <button type="button" onClick={onBanIp} disabled={runningPlayerAction !== null}>
            Ban IP
          </button>
          <button type="button" onClick={onUnbanIp} disabled={runningPlayerAction !== null}>
            Unban IP
          </button>
        </div>
      </article>

      <div className="dual-grid">
        <article className="panel">
          <h3>Known Players</h3>
          <ul className="list list-compact">
            {(state?.knownPlayers ?? []).slice(0, 18).map((entry) => (
              <li key={entry.uuid}>
                <div>
                  <strong>{entry.name}</strong>
                  <span>{entry.uuid}</span>
                </div>
              </li>
            ))}
            {(state?.knownPlayers.length ?? 0) === 0 ? (
              <li>
                <div>
                  <strong>No players recorded</strong>
                  <span>Players will be listed after connections are observed.</span>
                </div>
              </li>
            ) : null}
          </ul>
        </article>

        <article className="panel">
          <h3>Admin and Runtime Events</h3>
          <ul className="list list-compact">
            {(state?.history ?? []).slice(0, 18).map((entry, index) => (
              <li key={`${entry.ts}-${entry.kind}-${index}`}>
                <div>
                  <strong>{entry.kind}</strong>
                  <span>{entry.subject}</span>
                  <span>{entry.detail}</span>
                  <span>{new Date(entry.ts).toLocaleString()}</span>
                </div>
                <span className={`status-pill ${entry.source === "admin" ? "tone-neutral" : "tone-ok"}`}>{entry.source}</span>
              </li>
            ))}
            {(state?.history.length ?? 0) === 0 ? (
              <li>
                <div>
                  <strong>No history yet</strong>
                  <span>Player actions and runtime events will appear here.</span>
                </div>
              </li>
            ) : null}
          </ul>
        </article>
      </div>
    </section>
  );
}
