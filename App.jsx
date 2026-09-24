import { useEffect, useState } from "react";

const filterOptions = [
  { value: "all", label: "すべて" },
  { value: "active", label: "未完了" },
  { value: "completed", label: "完了済み" },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("week15-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("week15-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();
    const text = input.trim();

    if (text === "") return;

    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  const completedCount = tasks.filter((task) => task.done).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Week 15 / React state
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Task Garden
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-400">
              今日やることを、ひとつずつ育てよう。追加・完了・削除をすぐに管理できます。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 sm:min-w-52">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Progress</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-3xl font-bold text-white">{progress}%</p>
              <p className="pb-1 text-sm text-slate-400">
                {completedCount} / {tasks.length} complete
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.45fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/30 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-cyan-300">New task</p>
                <h2 className="mt-1 text-2xl font-bold text-white">今日の予定を追加</h2>
              </div>
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                {tasks.length} tasks
              </span>
            </div>

            <form onSubmit={addTask} className="space-y-3">
              <label htmlFor="task-input" className="text-sm font-medium text-slate-300">
                タスク名
              </label>
              <input
                id="task-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="例：Reactの復習をする"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                + タスクを追加
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">How to use</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-400">
                <li className="flex gap-3"><span className="text-cyan-300">01</span>Enterキーでもタスクを追加</li>
                <li className="flex gap-3"><span className="text-cyan-300">02</span>チェックで完了状態を切り替え</li>
                <li className="flex gap-3"><span className="text-cyan-300">03</span>リロード後もタスクを保持</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-100 p-5 text-slate-900 shadow-2xl shadow-slate-950/30 sm:p-7">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-700">Your list</p>
                <h2 className="mt-1 text-2xl font-bold">タスク一覧</h2>
              </div>
              <div className="flex rounded-xl bg-slate-200 p-1" aria-label="タスクのフィルター">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${
                      filter === option.value
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {visibleTasks.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-3xl">✦</div>
                <h3 className="text-lg font-bold">表示するタスクがありません</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  {tasks.length === 0 ? "左のフォームから、最初のタスクを追加しましょう。" : "別のフィルターを選んで確認してみましょう。"}
                </p>
              </div>
            ) : (
              <ul className="mt-5 space-y-3">
                {visibleTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition ${
                      task.done ? "border-cyan-200 bg-cyan-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      className="h-5 w-5 accent-cyan-500"
                      aria-label={`${task.text}を完了にする`}
                    />
                    <span className={`min-w-0 flex-1 break-words text-sm font-medium ${task.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                      {task.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-slate-600">
          Built with React state and Tailwind CSS
        </footer>
      </div>
    </main>
  );
}

export default App;
