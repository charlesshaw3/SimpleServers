import { ReactNode } from "react";

export type WorkspaceTab = "dashboard" | "console" | "players" | "backups" | "scheduler" | "settings";

type WorkspacePlayer = {
  name: string;
  uuid: string;
};

type WorkspaceLayoutProps = {
  serverName: string;
  serverVersion: string;
  serverStatus: string;
  publicAddress: string | null;
  playerCapacityLabel: string;
  canStart: boolean;
  canStop: boolean;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
  onKill: () => void;
  activeTab: WorkspaceTab;
  onChangeTab: (tab: WorkspaceTab) => void;
  players: WorkspacePlayer[];
  playerSearch: string;
  onPlayerSearchChange: (value: string) => void;
  children: ReactNode;
};

const tabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "console", label: "Console" },
  { id: "players", label: "Players" },
  { id: "backups", label: "Backups" },
  { id: "scheduler", label: "Scheduler" },
  { id: "settings", label: "Settings" }
];

export function WorkspaceLayout(props: WorkspaceLayoutProps) {
  const {
    serverName,
    serverVersion,
    serverStatus,
    publicAddress,
    playerCapacityLabel,
    canStart,
    canStop,
    onStart,
    onStop,
    onRestart,
    onKill,
    activeTab,
    onChangeTab,
    players,
    playerSearch,
    onPlayerSearchChange,
    children
  } = props;

  const filteredPlayers = players.filter((entry) => entry.name.toLowerCase().includes(playerSearch.trim().toLowerCase()));

  return (
    <section className="v2-workspace">
      <header className="panel v2-workspace-header">
        <div>
          <h2>{serverName}</h2>
          <p className="muted-note">{serverVersion}</p>
        </div>
        <div className="v2-workspace-meta">
          <span className="status-pill tone-ok">{serverStatus}</span>
          <span className="muted-note">
            Java <code>{publicAddress ?? "No invite address yet"}</code>
          </span>
          <span className="status-pill tone-neutral">{playerCapacityLabel}</span>
        </div>
      </header>

      <section className="panel v2-workspace-controls">
        <h3>Server Controls</h3>
        <div className="inline-actions">
          <button type="button" onClick={onStart} disabled={!canStart}>
            Start
          </button>
          <button type="button" onClick={onStop} disabled={!canStop}>
            Stop
          </button>
          <button type="button" onClick={onRestart}>
            Restart
          </button>
          <button type="button" className="danger-btn" onClick={onKill}>
            Kill
          </button>
        </div>
      </section>

      <section className="v2-workspace-grid">
        <article className="panel v2-workspace-main">
          <nav className="v2-workspace-tabs" aria-label="Server workspace tabs">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" className={activeTab === tab.id ? "active" : ""} onClick={() => onChangeTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="v2-tab-content">{children}</div>
        </article>

        <aside className="panel v2-workspace-rail">
          <div className="v2-rail-header">
            <h3>Online Players</h3>
            <span className="muted-note">{filteredPlayers.length}</span>
          </div>
          <label>
            Search players
            <input value={playerSearch} onChange={(event) => onPlayerSearchChange(event.target.value)} placeholder="Player name..." />
          </label>
          <ul className="list list-compact">
            {filteredPlayers.map((entry) => (
              <li key={entry.uuid}>
                <div>
                  <strong>{entry.name}</strong>
                  <span>{entry.uuid}</span>
                </div>
              </li>
            ))}
            {filteredPlayers.length === 0 ? (
              <li>
                <div>
                  <strong>No players found</strong>
                  <span>Players will appear here while the server is running.</span>
                </div>
              </li>
            ) : null}
          </ul>
        </aside>
      </section>
    </section>
  );
}
