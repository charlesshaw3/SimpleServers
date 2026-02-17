type ViewerIdentity = {
  username: string;
  role: "owner" | "admin" | "moderator" | "viewer" | null;
};

type ConnectionStatusProps = {
  connected: boolean;
  busy: boolean;
  viewer: ViewerIdentity | null;
  apiBase: string;
  token: string;
  onApiBaseChange: (value: string) => void;
  onTokenChange: (value: string) => void;
  onConnect: () => void;
};

export function ConnectionStatus(props: ConnectionStatusProps) {
  const { connected, busy, viewer, apiBase, token, onApiBaseChange, onTokenChange, onConnect } = props;

  return (
    <header className="v2-connection panel">
      <div className="v2-connection-title">
        <h1>SimpleServers</h1>
        <p>Self-host Minecraft servers with a focused workflow.</p>
        <div className="v2-connection-meta">
          <span className={`status-pill ${connected ? "tone-ok" : "tone-warn"}`}>{connected ? "Connected" : "Disconnected"}</span>
          {viewer ? (
            <span className="muted-note">
              Signed in as <strong>{viewer.username}</strong>
              {viewer.role ? ` (${viewer.role})` : ""}
            </span>
          ) : null}
        </div>
      </div>
      <form
        className="v2-connection-form"
        onSubmit={(event) => {
          event.preventDefault();
          onConnect();
        }}
      >
        <label>
          API Base
          <input value={apiBase} onChange={(event) => onApiBaseChange(event.target.value)} />
        </label>
        <label>
          API Token
          <input type="password" value={token} onChange={(event) => onTokenChange(event.target.value)} />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Connecting..." : connected ? "Reconnect" : "Connect"}
        </button>
      </form>
    </header>
  );
}
