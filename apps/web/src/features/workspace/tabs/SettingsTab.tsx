type ThemePreference = "colorful" | "dark" | "light" | "system";

type RemoteState = {
  enabled: boolean;
  requireToken: boolean;
  configuredToken: boolean;
  allowedOrigins: string[];
};

type SettingsTabProps = {
  themePreference: ThemePreference;
  remoteState: RemoteState | null;
  trustSigned: boolean | null;
  onThemeChange: (theme: ThemePreference) => void;
  onOpenLegacyWorkspace: () => void;
  onRunCrashDoctor: () => void;
  onRefreshAll: () => void;
};

export function SettingsTab(props: SettingsTabProps) {
  const { themePreference, remoteState, trustSigned, onThemeChange, onOpenLegacyWorkspace, onRunCrashDoctor, onRefreshAll } = props;

  return (
    <section className="v2-settings-tab">
      <article className="panel">
        <h3>Workspace Settings</h3>
        <div className="grid-form">
          <label>
            Theme
            <select value={themePreference} onChange={(event) => onThemeChange(event.target.value as ThemePreference)}>
              <option value="colorful">Colorful</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </label>
          <div className="inline-actions">
            <button type="button" onClick={onRefreshAll}>
              Refresh State
            </button>
            <button type="button" onClick={onRunCrashDoctor}>
              Run Crash Doctor
            </button>
          </div>
        </div>
      </article>

      <article className="panel">
        <h3>Security Snapshot</h3>
        <ul className="list list-compact">
          <li>
            <div>
              <strong>Remote Control</strong>
              <span>{remoteState?.enabled ? "Enabled" : "Disabled"}</span>
            </div>
            <span className={`status-pill ${remoteState?.enabled ? "tone-warn" : "tone-ok"}`}>{remoteState?.enabled ? "Review" : "Safe Default"}</span>
          </li>
          <li>
            <div>
              <strong>Remote Token</strong>
              <span>{remoteState?.configuredToken ? "Configured" : "Missing"}</span>
            </div>
            <span className={`status-pill ${remoteState?.configuredToken ? "tone-ok" : "tone-warn"}`}>
              {remoteState?.configuredToken ? "Ready" : "Action Needed"}
            </span>
          </li>
          <li>
            <div>
              <strong>Build Signature</strong>
              <span>{trustSigned === null ? "Unavailable" : trustSigned ? "Signed" : "Unsigned/Unknown"}</span>
            </div>
            <span className={`status-pill ${trustSigned ? "tone-ok" : "tone-warn"}`}>{trustSigned ? "Verified" : "Review"}</span>
          </li>
        </ul>
      </article>

      <details className="panel">
        <summary>Advanced Tools</summary>
        <p className="muted-note">
          Full expert surfaces remain available in the legacy workspace while v2 parity rollout continues.
        </p>
        <button type="button" onClick={onOpenLegacyWorkspace}>
          Open Legacy Workspace
        </button>
      </details>
    </section>
  );
}
