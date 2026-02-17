import { FormEvent } from "react";

type ServerOption = {
  id: string;
  name: string;
};

type TaskRecord = {
  id: string;
  name: string;
  action: string;
  cronExpr: string;
  enabled: number;
  lastStatus: string | null;
  lastRunAt: string | null;
};

type TaskFormModel = {
  serverId: string;
  name: string;
  cronExpr: string;
  action: "restart" | "backup" | "command";
  command: string;
};

type SchedulerTabProps = {
  servers: ServerOption[];
  tasks: TaskRecord[];
  taskForm: TaskFormModel;
  onPatchTaskForm: (patch: Partial<TaskFormModel>) => void;
  onCreateTask: (event: FormEvent) => void;
  onToggleTask: (task: TaskRecord) => void;
};

export function SchedulerTab(props: SchedulerTabProps) {
  const { servers, tasks, taskForm, onPatchTaskForm, onCreateTask, onToggleTask } = props;

  return (
    <section className="v2-scheduler-tab">
      <article className="panel">
        <h3>Scheduler</h3>
        <p className="muted-note">Automate recurring restart, backup, or command tasks.</p>
        <form
          className="grid-form"
          onSubmit={(event) => {
            event.preventDefault();
            onCreateTask(event);
          }}
        >
          <label>
            Server
            <select value={taskForm.serverId} onChange={(event) => onPatchTaskForm({ serverId: event.target.value })}>
              {servers.map((server) => (
                <option key={server.id} value={server.id}>
                  {server.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Name
            <input value={taskForm.name} onChange={(event) => onPatchTaskForm({ name: event.target.value })} />
          </label>
          <label>
            Cron
            <input value={taskForm.cronExpr} onChange={(event) => onPatchTaskForm({ cronExpr: event.target.value })} />
          </label>
          <label>
            Action
            <select
              value={taskForm.action}
              onChange={(event) => onPatchTaskForm({ action: event.target.value as "restart" | "backup" | "command" })}
            >
              <option value="backup">backup</option>
              <option value="restart">restart</option>
              <option value="command">command</option>
            </select>
          </label>
          {taskForm.action === "command" ? (
            <label>
              Command
              <input value={taskForm.command} onChange={(event) => onPatchTaskForm({ command: event.target.value })} />
            </label>
          ) : null}
          <button type="submit">Create Task</button>
        </form>
      </article>

      <article className="panel">
        <h3>Scheduled Tasks</h3>
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id}>
              <div>
                <strong>{task.name}</strong>
                <span>
                  {task.action} at <code>{task.cronExpr}</code>
                </span>
                <span>
                  Last: {task.lastStatus ?? "n/a"} {task.lastRunAt ? `(${new Date(task.lastRunAt).toLocaleString()})` : ""}
                </span>
              </div>
              <button type="button" onClick={() => onToggleTask(task)}>
                {task.enabled ? "Disable" : "Enable"}
              </button>
            </li>
          ))}
          {tasks.length === 0 ? (
            <li>
              <div>
                <strong>No tasks yet</strong>
                <span>Create your first automated operation above.</span>
              </div>
            </li>
          ) : null}
        </ul>
      </article>
    </section>
  );
}
