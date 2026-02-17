type BackupRecord = {
  id: string;
  sizeBytes: number;
  createdAt: string;
  restoredAt: string | null;
};

type BackupPolicy = {
  maxBackups: number;
  maxAgeDays: number;
  pruneCron: string;
  enabled: number;
};

type BackupsTabProps = {
  backups: BackupRecord[];
  backupPolicy: BackupPolicy | null;
  onPatchPolicy: (patch: Partial<BackupPolicy>) => void;
  onCreateBackup: () => void;
  onRestoreBackup: (backupId: string) => void;
  onSavePolicy: () => void;
  onPruneNow: () => void;
};

export function BackupsTab(props: BackupsTabProps) {
  const { backups, backupPolicy, onPatchPolicy, onCreateBackup, onRestoreBackup, onSavePolicy, onPruneNow } = props;

  return (
    <section className="v2-backups-tab">
      <article className="panel">
        <h3>Backups and Retention</h3>
        <p className="muted-note">Restore operations create a safety snapshot before replacement.</p>
        <div className="inline-actions">
          <button type="button" onClick={onCreateBackup}>
            Create Backup
          </button>
          <button type="button" onClick={onPruneNow}>
            Prune Now
          </button>
        </div>
      </article>

      <article className="panel">
        <h3>Retention Policy</h3>
        <div className="grid-form">
          <label>
            Max Backups
            <input
              type="number"
              value={backupPolicy?.maxBackups ?? 20}
              onChange={(event) => onPatchPolicy({ maxBackups: Number(event.target.value) })}
            />
          </label>
          <label>
            Max Age (days)
            <input
              type="number"
              value={backupPolicy?.maxAgeDays ?? 30}
              onChange={(event) => onPatchPolicy({ maxAgeDays: Number(event.target.value) })}
            />
          </label>
          <label>
            Prune Cron
            <input value={backupPolicy?.pruneCron ?? "0 */6 * * *"} onChange={(event) => onPatchPolicy({ pruneCron: event.target.value })} />
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={Boolean(backupPolicy?.enabled)}
              onChange={(event) => onPatchPolicy({ enabled: event.target.checked ? 1 : 0 })}
            />
            Retention enabled
          </label>
          <button type="button" onClick={onSavePolicy}>
            Save Policy
          </button>
        </div>
      </article>

      <article className="panel">
        <h3>Backup Archives</h3>
        <ul className="list">
          {backups.map((backup) => (
            <li key={backup.id}>
              <div>
                <strong>{new Date(backup.createdAt).toLocaleString()}</strong>
                <span>{(backup.sizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                <span>{backup.restoredAt ? `restored at ${new Date(backup.restoredAt).toLocaleString()}` : "not restored"}</span>
              </div>
              <button type="button" onClick={() => onRestoreBackup(backup.id)}>
                Restore
              </button>
            </li>
          ))}
          {backups.length === 0 ? (
            <li>
              <div>
                <strong>No backups yet</strong>
                <span>Create a backup before risky changes.</span>
              </div>
            </li>
          ) : null}
        </ul>
      </article>
    </section>
  );
}
