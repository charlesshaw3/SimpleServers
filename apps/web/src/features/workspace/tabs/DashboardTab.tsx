type StartupSample = {
  createdAt: string;
  durationMs: number;
  success: boolean;
};

type DashboardTabProps = {
  serverCount: number;
  openAlerts: number;
  crashes: number;
  cpuPeakPercent: number;
  memoryPeakMb: number;
  uptimeSeconds: number | null;
  quickAddress: string | null;
  startupSamples: StartupSample[];
  onGoLive: () => void;
  onCopyAddress: () => void;
};

function buildLinePath(samples: StartupSample[]): string {
  if (samples.length === 0) {
    return "";
  }
  const width = 620;
  const height = 180;
  const maxDuration = Math.max(...samples.map((entry) => entry.durationMs), 1);
  return samples
    .map((entry, index) => {
      const x = (index / Math.max(1, samples.length - 1)) * width;
      const y = height - (entry.durationMs / maxDuration) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function DashboardTab(props: DashboardTabProps) {
  const {
    serverCount,
    openAlerts,
    crashes,
    cpuPeakPercent,
    memoryPeakMb,
    uptimeSeconds,
    quickAddress,
    startupSamples,
    onGoLive,
    onCopyAddress
  } = props;

  const path = buildLinePath(startupSamples.slice(-18));

  return (
    <section className="v2-dashboard-tab">
      <div className="v2-metric-grid">
        <article>
          <h3>CPU Usage</h3>
          <strong>{cpuPeakPercent.toFixed(1)}%</strong>
          <span className="muted-note">peak in current advisor window</span>
        </article>
        <article>
          <h3>RAM Usage</h3>
          <strong>{Math.round(memoryPeakMb)} MB</strong>
          <span className="muted-note">peak in current advisor window</span>
        </article>
        <article>
          <h3>Server Uptime</h3>
          <strong>{uptimeSeconds !== null ? `${uptimeSeconds}s` : "n/a"}</strong>
          <span className="muted-note">runtime clock estimate</span>
        </article>
      </div>

      <article className="panel v2-chart-panel">
        <div className="v2-chart-header">
          <h3>Startup Trend</h3>
          <div className="inline-actions">
            <span className="status-pill tone-neutral">{serverCount} servers</span>
            <span className={`status-pill ${openAlerts > 0 ? "tone-warn" : "tone-ok"}`}>{openAlerts} open alerts</span>
            <span className={`status-pill ${crashes > 0 ? "tone-warn" : "tone-ok"}`}>{crashes} crashes</span>
          </div>
        </div>
        {path ? (
          <svg viewBox="0 0 620 180" className="v2-startup-chart" role="img" aria-label="Startup duration trend">
            <path d={path} />
          </svg>
        ) : (
          <p className="muted-note">No startup trend samples yet. Start and restart the server to build trend data.</p>
        )}
      </article>

      <article className="panel">
        <h3>Share Status</h3>
        <p className="muted-note">
          {quickAddress ? (
            <>
              Invite ready: <code>{quickAddress}</code>
            </>
          ) : (
            "No public invite address yet. Run Go Live to generate one."
          )}
        </p>
        <div className="inline-actions">
          <button type="button" onClick={onGoLive}>
            Go Live
          </button>
          {quickAddress ? (
            <button type="button" onClick={onCopyAddress}>
              Copy Address
            </button>
          ) : null}
        </div>
      </article>
    </section>
  );
}
