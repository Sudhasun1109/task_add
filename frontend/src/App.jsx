import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      if (!response.ok) throw new Error("Could not connect to the API.");
      setTasks(await response.json());
    } catch {
      setError("Can't reach the backend. Check that the API and PostgreSQL are running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  const completedCount = tasks.filter((task) => task.completed).length;

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add task.");
      setTasks((current) => [data, ...current]);
      setTitle("");
    } catch (err) {
      setError(err.message || "Could not add task.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleTask(task) {
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update task.");
      setTasks((current) => current.map((item) => item.id === data.id ? data : item));
    } catch (err) {
      setError(err.message || "Could not update task.");
    }
  }

  async function deleteTask(id) {
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not delete task.");
      }
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete task.");
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="TaskNest home">
          <span className="brand-mark">✓</span><span>tasknest</span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> Your little space to get things done</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="sparkle">✳</span> YOUR DAY, YOUR WAY</div>
        <h1>Make room for<br /><span>what matters.</span></h1>
        <p className="hero-copy">Small steps add up. Capture your tasks, keep your focus, and enjoy the progress.</p>
      </section>

      <section className="workspace">
        <div className="workspace-heading">
          <div>
            <p className="section-kicker">MY WORKSPACE</p>
            <h2>Today's tasks <span className="count-pill">{tasks.length}</span></h2>
          </div>
          <div className="progress-summary">
            <div className="progress-ring"><span>{tasks.length ? Math.round(completedCount / tasks.length * 100) : 0}%</span></div>
            <div><strong>{completedCount} of {tasks.length}</strong><small>tasks completed</small></div>
          </div>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <span className="plus">＋</span>
          <input
            aria-label="New task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What would you like to get done?"
            maxLength={200}
          />
          <button type="submit" disabled={!title.trim() || busy}>{busy ? "Adding…" : "Add task"} <span>↗</span></button>
        </form>

        <div className="task-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {["all", "active", "completed"].map((item) => (
              <button key={item} className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)} type="button">
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <button className="refresh-button" onClick={loadTasks} type="button" title="Refresh tasks">↻ <span>Refresh</span></button>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}
        {loading ? (
          <div className="empty-state"><div className="empty-icon">◌</div><h3>Loading your tasks…</h3><p>Getting your workspace ready.</p></div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{filter === "completed" ? "✧" : "☀"}</div>
            <h3>{filter === "completed" ? "No completed tasks yet" : filter === "active" ? "You're all caught up!" : "A fresh start"}</h3>
            <p>{filter === "active" ? "Nothing left on your active list. Nice work." : "Add a task above and take the first small step."}</p>
          </div>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className={task.completed ? "task-row is-complete" : "task-row"} key={task.id}>
                <button className={task.completed ? "check-button checked" : "check-button"} onClick={() => toggleTask(task)} type="button" aria-label={task.completed ? "Mark as active" : "Mark as completed"}>{task.completed ? "✓" : ""}</button>
                <div className="task-content"><span>{task.title}</span><small>{task.completed ? "Completed" : "In progress"}</small></div>
                <button className="delete-button" onClick={() => deleteTask(task.id)} type="button" aria-label={`Delete ${task.title}`} title="Delete task">×</button>
              </li>
            ))}
          </ul>
        )}
        <footer className="workspace-footer"><span><span className="tiny-lock">▣</span> Saved to your PostgreSQL database</span><span>{tasks.length - completedCount} remaining</span></footer>
      </section>
      <p className="page-footer">Made for focused days <span>✳</span></p>
    </main>
  );
}
