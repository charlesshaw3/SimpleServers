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
  publicHostingSettings: {
    autoEnable: boolean;
    defaultProvider: "playit" | "cloudflared" | "ngrok" | "manual";
    consentVersion: string | null;
    consentAcceptedAt: string | null;
    consentCurrentVersion: string;
    consentRequired?: boolean;
  } | null;
  savingPublicHostingSettings: boolean;
  playitTermsUrl: string;
  playitPrivacyUrl: string;
  onThemeChange: (theme: ThemePreference) => void;
  onSavePublicHostingSettings: (patch: Partial<{ autoEnable: boolean; defaultProvider: "playit" | "cloudflared" | "ngrok" | "manual"; consentAccepted: boolean }>) => void;
  onEnableQuickHosting: (provider?: "playit" | "cloudflared" | "ngrok" | "manual") => void;
  onOpenLegacyWorkspace: () => void;
  onRunCrashDoctor: () => void;
  onRefreshAll: () => void;
};

export function SettingsTab(props: SettingsTabProps) {
  const {
    themePreference,
    remoteState,
    trustSigned,
    publicHostingSettings,
    savingPublicHostingSettings,
    playitTermsUrl,
    playitPrivacyUrl,
    onThemeChange,
    onSavePublicHostingSettings,
    onEnableQuickHosting,
    onOpenLegacyWorkspace,
    onRunCrashDoctor,
    onRefreshAll
  } = props;

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
        <h3>Public Hosting Defaults</h3>
        <p className="muted-note">Default provider and automatic tunneling behavior for this server.</p>
        <div className="grid-form">
          <label className="toggle">
            <input
              type="checkbox"
              checked={Boolean(publicHostingSettings?.autoEnable)}
              onChange={(event) => onSavePublicHostingSettings({ autoEnable: event.target.checked })}
              disabled={savingPublicHostingSettings}
            />
            Auto-enable public hosting on start/restart
          </label>
          <label>
            Default Provider
            <select
              value={publicHostingSettings?.defaultProvider ?? "playit"}
              onChange={(event) =>
                onSavePublicHostingSettings({
                  defaultProvider: event.target.value as "playit" | "cloudflared" | "ngrok" | "manual"
                })
              }
              disabled={savingPublicHostingSettings}
            >
              <option value="playit">playit</option>
              <option value="cloudflared">cloudflared</option>
              <option value="ngrok">ngrok</option>
              <option value="manual">manual</option>
            </select>
          </label>
          <div className="inline-actions">
            <button
              type="button"
              onClick={() => onEnableQuickHosting(publicHostingSettings?.defaultProvider ?? "playit")}
              disabled={savingPublicHostingSettings}
            >
              Enable Now
            </button>
            {publicHostingSettings?.defaultProvider === "playit" &&
            (publicHostingSettings?.consentRequired || !publicHostingSettings?.consentAcceptedAt) ? (
              <button type="button" onClick={() => onSavePublicHostingSettings({ consentAccepted: true })} disabled={savingPublicHostingSettings}>
                Accept Playit Terms
              </button>
            ) : null}
          </div>
        </div>
        <p className="muted-note">
          Public hosting uses Playit.gg by default. By enabling it, you agree to{" "}
          <a href={playitTermsUrl} target="_blank" rel="noreferrer">
            Playit Terms
          </a>{" "}
          and{" "}
          <a href={playitPrivacyUrl} target="_blank" rel="noreferrer">
            Playit Privacy Policy
          </a>
          .
        </p>
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
          Advanced operations remain available here, with legacy fallback for deep admin workflows.
        </p>
        <div className="inline-actions">
          <button type="button" onClick={onRefreshAll}>
            Refresh Diagnostics
          </button>
          <button type="button" onClick={onRunCrashDoctor}>
            Crash Doctor
          </button>
          <button type="button" onClick={onOpenLegacyWorkspace}>
            Open Legacy Workspace
          </button>
        </div>
      </details>
    </section>
  );
}
