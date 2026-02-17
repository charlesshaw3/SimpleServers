type WizardServerType = "vanilla" | "paper" | "fabric";
type WizardMemoryPreset = "small" | "recommended" | "large";
type WizardWorldSource = "new" | "import";

type SetupModel = {
  name: string;
  type: WizardServerType;
  mcVersion: string;
  memoryPreset: WizardMemoryPreset;
  savePath: string;
  worldSource: WizardWorldSource;
  worldImportPath: string;
  quickPublicHosting: boolean;
  allowCracked: boolean;
  enableGeyser: boolean;
  enableFloodgate: boolean;
};

type SetupWizardProps = {
  visible: boolean;
  busy: boolean;
  step: 1 | 2 | 3 | 4 | 5;
  model: SetupModel;
  error: string | null;
  versionOptions: string[];
  hardwareMemoryGb: number | null;
  phase: "form" | "launching" | "done";
  launchProgress: string[];
  launchAddress: string | null;
  preflightHints: string[];
  onClose: () => void;
  onSetStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  onPatch: (patch: Partial<SetupModel>) => void;
  onNext: () => void;
  onBack: () => void;
  onLaunch: () => void;
  onContinueToWorkspace: () => void;
};

const stepLabels: Array<{ step: 1 | 2 | 3 | 4 | 5; label: string }> = [
  { step: 1, label: "Detect" },
  { step: 2, label: "Server Type" },
  { step: 3, label: "World" },
  { step: 4, label: "Performance" },
  { step: 5, label: "Review" }
];

export function SetupWizard(props: SetupWizardProps) {
  const {
    visible,
    busy,
    step,
    model,
    error,
    versionOptions,
    hardwareMemoryGb,
    phase,
    launchProgress,
    launchAddress,
    preflightHints,
    onClose,
    onSetStep,
    onPatch,
    onNext,
    onBack,
    onLaunch,
    onContinueToWorkspace
  } = props;

  if (!visible) {
    return null;
  }

  return (
    <section className="v2-wizard-backdrop" role="presentation">
      <article className="v2-wizard panel" role="dialog" aria-modal="true" aria-label="Server setup wizard">
        <div className="v2-wizard-header">
          <div>
            <h2>Minecraft Server Setup Wizard</h2>
            <p className="muted-note">Configure your server in a focused 5-step flow.</p>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <ol className="v2-wizard-steps">
          {stepLabels.map((entry) => (
            <li key={entry.step} className={step === entry.step ? "active" : step > entry.step ? "done" : ""}>
              <button type="button" onClick={() => onSetStep(entry.step)} disabled={phase !== "form"}>
                <span>{entry.step}</span>
                {entry.label}
              </button>
            </li>
          ))}
        </ol>

        {phase === "form" ? (
          <div className="v2-wizard-body">
            {step === 1 ? (
              <section className="v2-step-block">
                <h3>Detect Java Environment</h3>
                <p className="muted-note">SimpleServers can use managed Java automatically. Continue if the defaults look right.</p>
                <ul className="list list-compact">
                  <li>
                    <div>
                      <strong>Java runtime</strong>
                      <span>Managed runtime is available and can be provisioned automatically.</span>
                    </div>
                    <span className="status-pill tone-ok">Ready</span>
                  </li>
                  <li>
                    <div>
                      <strong>Host memory profile</strong>
                      <span>{hardwareMemoryGb ? `${hardwareMemoryGb} GB RAM detected` : "Hardware profile unavailable; defaults still safe."}</span>
                    </div>
                    <span className="status-pill tone-neutral">Info</span>
                  </li>
                  <li>
                    <div>
                      <strong>Tunnel provider</strong>
                      <span>Quick hosting can be enabled during launch for a public invite address.</span>
                    </div>
                    <span className="status-pill tone-neutral">Optional</span>
                  </li>
                </ul>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="v2-step-block">
                <h3>Choose Server Type</h3>
                <p className="muted-note">Pick the runtime that matches your gameplay goals.</p>
                <div className="v2-server-type-grid">
                  <button type="button" className={model.type === "paper" ? "active" : ""} onClick={() => onPatch({ type: "paper" })}>
                    <strong>Paper</strong>
                    <span>Optimized performance with plugin ecosystem support.</span>
                    <small>Best for crossplay + plugin-heavy setups.</small>
                  </button>
                  <button type="button" className={model.type === "vanilla" ? "active" : ""} onClick={() => onPatch({ type: "vanilla" })}>
                    <strong>Vanilla</strong>
                    <span>Unmodified official Minecraft behavior.</span>
                    <small>Recommended for beginners.</small>
                  </button>
                  <button type="button" className={model.type === "fabric" ? "active" : ""} onClick={() => onPatch({ type: "fabric" })}>
                    <strong>Fabric</strong>
                    <span>Lightweight modding platform for custom packs.</span>
                    <small>Best for modded gameplay.</small>
                  </button>
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section className="v2-step-block">
                <h3>World Setup</h3>
                <p className="muted-note">Start with a new world or import an existing world folder.</p>
                <div className="inline-actions">
                  <button
                    type="button"
                    className={model.worldSource === "new" ? "active" : ""}
                    onClick={() => onPatch({ worldSource: "new" })}
                  >
                    Create New World
                  </button>
                  <button
                    type="button"
                    className={model.worldSource === "import" ? "active" : ""}
                    onClick={() => onPatch({ worldSource: "import" })}
                  >
                    Import Existing World
                  </button>
                </div>
                <div className="grid-form">
                  <label>
                    Minecraft Version
                    <select value={model.mcVersion} onChange={(event) => onPatch({ mcVersion: event.target.value })}>
                      {versionOptions.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                    </select>
                  </label>
                  {model.worldSource === "import" ? (
                    <label>
                      World Folder Path
                      <input
                        value={model.worldImportPath}
                        onChange={(event) => onPatch({ worldImportPath: event.target.value })}
                        placeholder="/path/to/world-folder"
                      />
                    </label>
                  ) : null}
                </div>
              </section>
            ) : null}

            {step === 4 ? (
              <section className="v2-step-block">
                <h3>Performance Setup</h3>
                <p className="muted-note">Set server identity, location, and memory profile.</p>
                <div className="grid-form">
                  <label>
                    Server Name
                    <input value={model.name} onChange={(event) => onPatch({ name: event.target.value })} />
                  </label>
                  <label>
                    Save Location (optional)
                    <input value={model.savePath} onChange={(event) => onPatch({ savePath: event.target.value })} placeholder="Default if blank" />
                  </label>
                </div>
                <div className="v2-memory-preset-row">
                  <button type="button" className={model.memoryPreset === "small" ? "active" : ""} onClick={() => onPatch({ memoryPreset: "small" })}>
                    Small
                  </button>
                  <button
                    type="button"
                    className={model.memoryPreset === "recommended" ? "active" : ""}
                    onClick={() => onPatch({ memoryPreset: "recommended" })}
                  >
                    Recommended
                  </button>
                  <button type="button" className={model.memoryPreset === "large" ? "active" : ""} onClick={() => onPatch({ memoryPreset: "large" })}>
                    Large
                  </button>
                </div>
                <div className="v2-memory-band" aria-hidden="true">
                  <span className={model.memoryPreset === "small" ? "active" : ""}>Lower footprint</span>
                  <span className={model.memoryPreset === "recommended" ? "active" : ""}>Balanced</span>
                  <span className={model.memoryPreset === "large" ? "active" : ""}>Higher allocation</span>
                </div>
              </section>
            ) : null}

            {step === 5 ? (
              <section className="v2-step-block">
                <h3>Review Setup</h3>
                <ul className="list list-compact">
                  <li>
                    <div>
                      <strong>Server Type</strong>
                      <span>{model.type}</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Minecraft Version</strong>
                      <span>{model.mcVersion}</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Memory Profile</strong>
                      <span>{model.memoryPreset}</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>World Source</strong>
                      <span>{model.worldSource === "import" ? "Import existing world" : "Create new world"}</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>Quick Hosting</strong>
                      <span>{model.quickPublicHosting ? "Enabled" : "Disabled"}</span>
                    </div>
                  </li>
                </ul>
                {preflightHints.length > 0 ? (
                  <>
                    <h4>Preflight Risk Hints</h4>
                    <ul className="tip-list">
                      {preflightHints.map((hint) => (
                        <li key={hint}>{hint}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : null}
          </div>
        ) : null}

        {phase === "launching" ? (
          <section className="v2-wizard-launch">
            <h3>Launching Server</h3>
            <p className="muted-note">Creating server, starting runtime, and resolving tunnel endpoint.</p>
            <ul className="list list-compact">
              {launchProgress.map((entry) => (
                <li key={entry}>
                  <div>
                    <span>{entry}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {phase === "done" ? (
          <section className="v2-wizard-done">
            <h3>Server Ready</h3>
            <p className="muted-note">Your server is running. Continue to the workspace tabs for live control.</p>
            <div className="v2-wizard-address">
              <span>Invite Address</span>
              <code>{launchAddress ?? "Not yet assigned. Continue to workspace and run Go Live."}</code>
            </div>
            <div className="inline-actions">
              {launchAddress ? (
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(launchAddress);
                  }}
                >
                  Copy Address
                </button>
              ) : null}
              <button type="button" className="primary-cta" onClick={onContinueToWorkspace}>
                Continue to Dashboard
              </button>
            </div>
          </section>
        ) : null}

        {error ? <div className="error-banner">{error}</div> : null}

        {phase === "form" ? (
          <div className="v2-wizard-actions">
            <button type="button" onClick={onBack} disabled={step === 1 || busy}>
              Back
            </button>
            {step < 5 ? (
              <button type="button" onClick={onNext} disabled={busy}>
                Next
              </button>
            ) : (
              <button type="button" className="primary-cta" onClick={onLaunch} disabled={busy}>
                {busy ? "Launching..." : "Launch Server"}
              </button>
            )}
          </div>
        ) : null}
      </article>
    </section>
  );
}
