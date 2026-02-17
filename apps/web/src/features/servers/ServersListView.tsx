type ServerRow = {
  id: string;
  name: string;
  type: "vanilla" | "paper" | "fabric";
  mcVersion: string;
  port: number;
  status: string;
};

type ServersListViewProps = {
  servers: ServerRow[];
  filteredServers: ServerRow[];
  selectedServerId: string | null;
  search: string;
  busy: boolean;
  onSearchChange: (value: string) => void;
  onSelectServer: (serverId: string) => void;
  onOpenSetup: () => void;
  onOpenWorkspace: (serverId: string) => void;
  onDeleteServer: (server: ServerRow) => void;
  deletingServerId: string | null;
  statusTone: (status: string) => "ok" | "warn" | "error" | "neutral";
  normalizeStatus: (status?: string | null) => string;
};

export function ServersListView(props: ServersListViewProps) {
  const {
    servers,
    filteredServers,
    selectedServerId,
    search,
    busy,
    onSearchChange,
    onSelectServer,
    onOpenSetup,
    onOpenWorkspace,
    onDeleteServer,
    deletingServerId,
    statusTone,
    normalizeStatus
  } = props;

  const hasServers = servers.length > 0;

  return (
    <section className="v2-servers">
      <div className="v2-servers-toolbar panel">
        <div>
          <h2>Servers</h2>
          <p className="muted-note">
            {hasServers
              ? "Select a server to enter the workspace, or create another server."
              : "Start with one guided action, then continue in the workspace tabs."}
          </p>
        </div>
        <div className="inline-actions">
          <label className="compact-field">
            Search
            <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="name, type, version, port..." />
          </label>
          <button type="button" className="primary-cta" onClick={onOpenSetup} disabled={busy}>
            {busy ? "Working..." : hasServers ? "Create Server" : "Create Your First Server"}
          </button>
        </div>
      </div>

      {!hasServers ? (
        <article className="panel v2-empty-state">
          <h3>Ready to launch your first server?</h3>
          <p className="muted-note">Create, launch, and continue to a focused workspace in a single wizard flow.</p>
          <button type="button" className="primary-cta" onClick={onOpenSetup} disabled={busy}>
            Open Setup Wizard
          </button>
        </article>
      ) : (
        <section className="panel">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Version</th>
                <th>Status</th>
                <th>Port</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServers.map((server) => (
                <tr key={server.id} className={server.id === selectedServerId ? "selected" : ""}>
                  <td>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => {
                        onSelectServer(server.id);
                        onOpenWorkspace(server.id);
                      }}
                    >
                      {server.name}
                    </button>
                  </td>
                  <td>{server.type}</td>
                  <td>{server.mcVersion}</td>
                  <td>
                    <span className={`status-pill tone-${statusTone(server.status)}`}>{normalizeStatus(server.status)}</span>
                  </td>
                  <td>{server.port}</td>
                  <td>
                    <div className="inline-actions">
                      <button type="button" onClick={() => onOpenWorkspace(server.id)}>
                        Open Workspace
                      </button>
                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() => onDeleteServer(server)}
                        disabled={deletingServerId === server.id}
                      >
                        {deletingServerId === server.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredServers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-table-note">No servers matched your search.</div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
}
