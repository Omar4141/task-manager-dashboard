import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion} from "framer-motion";
import { FiFilter, FiPlus, FiSearch } from "react-icons/fi";
import OnboardingModal from "./components/OnboardingModal.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import KanbanBoard from "./components/KanbanBoard.jsx";
import TaskForm from "./components/TaskForm.jsx";
import StatsOverview from "./components/StatsOverview.jsx";
import ChatbotAssistant from "./components/ChatbotAssistant.jsx";
import CelebrationPopup from "./components/CelebrationPopup.jsx";
import FilterDropdown from "./components/FilterDropdown.jsx";

const USER_KEY = "tm-dashboard:user";
const TASKS_KEY = "tm-dashboard:tasks";
const THEME_KEY = "tm-dashboard:theme";

function loadJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    priority: "all",
    status: "all",
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const formContainerRef = useRef(null);

  useEffect(() => {
    const storedUser = loadJson(USER_KEY, null);
    if (storedUser) {
      setUser(storedUser);
    } else {
      setShowOnboarding(true);
    }

    const storedTheme =
      (typeof window !== "undefined" && window.localStorage.getItem(THEME_KEY)) ||
      "light";
    setTheme(storedTheme === "dark" ? "dark" : "light");

    const storedTasks = loadJson(TASKS_KEY, []);
    if (Array.isArray(storedTasks)) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!formOpen) return;
    if (!formContainerRef.current) return;
    // On small screens, scroll the task form into view when it opens
    if (window.innerWidth < 768) {
      formContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formOpen]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        filters.priority !== "all" &&
        task.priority?.toLowerCase() !== filters.priority.toLowerCase()
      ) {
        return false;
      }
      if (
        filters.status !== "all" &&
        task.status?.toLowerCase() !== filters.status.toLowerCase()
      ) {
        return false;
      }
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        if (!task.title?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const handleOnboardingSubmit = (profile) => {
    setUser(profile);
    setShowOnboarding(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_KEY, JSON.stringify(profile));
    }
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSaveTask = (task) => {
    setTasks((prev) => {
      if (task.id) {
        const existing = prev.find((t) => t.id === task.id);
        const updated = prev.map((t) => (t.id === task.id ? { ...t, ...task } : t));
        if (existing && existing.status !== "completed" && task.status === "completed") {
          setCelebrating(true);
        }
        return updated;
      }
      const newTask = {
        ...task,
        id: String(Date.now()),
      };
      if (newTask.status === "completed") {
        setCelebrating(true);
      }
      return [...prev, newTask];
    });
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) => {
      const existing = prev.find((t) => t.id === taskId);
      if (!existing) return prev;
      const becameCompleted = existing.status !== "completed" && newStatus === "completed";
      if (becameCompleted) {
        setCelebrating(true);
      }
      return prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddTaskFromAI = (taskDraft) => {
    setTasks((prev) => [
      ...prev,
      {
        ...taskDraft,
        id: String(Date.now()),
      },
    ]);
  };

  const statsSourceTasks = tasks;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-900 transition dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <OnboardingModal isOpen={showOnboarding} onSubmit={handleOnboardingSubmit} />
      <CelebrationPopup
        isOpen={celebrating}
        userName={user?.name}
        onClose={() => setCelebrating(false)}
      />
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-20 w-full max-w-[1700px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="relative group flex h-10 w-10 items-center justify-center rounded-2xl">
              <img
                src="/TaskM.png"
                alt="Task Manager logo"
                className="h-10 w-10 object-contain drop-shadow-sm"
              />
              <span className="pointer-events-none absolute -bottom-8 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
                TM
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-lg">
                  Task Manager Dashboard
                </h1>
                <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800/90 dark:text-slate-300 md:inline-flex">
                  Your Productivity workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                {user?.name ? `Welcome back, ${user.name}.` : "Organise work, track progress, and stay focused."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-8 px-4 pb-6 pt-6 sm:px-8 lg:px-12">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-xl">
              Your board
            </h2>
            <p className="text-[15px] text-slate-500 dark:text-slate-400">
              Drag tasks across stages, filter by priority or status, and keep everything in one clean view.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <div className="flex items-center gap-2 text-[14px] text-slate-500 dark:text-slate-400">
              <FiFilter className="h-3.5 w-3.5" />
              <span>Filters</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <FilterDropdown
                label="Priority"
                valueLabel=
                  {filters.priority === "all" ? "All priorities" : filters.priority}
                items={[
                  {
                    value: "all",
                    label: "All priorities",
                    active: filters.priority === "all",
                  },
                  {
                    value: "Low",
                    label: "Low priority",
                    dotClass:
                      "bg-emerald-400 dark:bg-emerald-300",
                    active: filters.priority === "Low",
                  },
                  {
                    value: "Medium",
                    label: "Medium priority",
                    dotClass:
                      "bg-amber-400 dark:bg-amber-300",
                    active: filters.priority === "Medium",
                  },
                  {
                    value: "High",
                    label: "High priority",
                    dotClass:
                      "bg-rose-400 dark:bg-rose-300",
                    active: filters.priority === "High",
                  },
                ]}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, priority: value }))
                }
              />
              <FilterDropdown
                label="Status"
                valueLabel={
                  filters.status === "all"
                    ? "All statuses"
                    : filters.status === "todo"
                    ? "To Do"
                    : filters.status === "in-progress"
                    ? "In Progress"
                    : "Completed"
                }
                items={[
                  {
                    value: "all",
                    label: "All statuses",
                    active: filters.status === "all",
                  },
                  {
                    value: "todo",
                    label: "To Do",
                    active: filters.status === "todo",
                  },
                  {
                    value: "in-progress",
                    label: "In Progress",
                    active: filters.status === "in-progress",
                  },
                  {
                    value: "completed",
                    label: "Completed",
                    active: filters.status === "completed",
                  },
                ]}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              />
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900">
                <FiSearch className="h-3 w-3 text-slate-400" />
                <input
                  type="search"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Search by title"
                  className="w-32 bg-transparent text-xs outline-none placeholder:text-slate-400 md:w-40"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="grid flex-1 grid-cols-12 gap-5">
          <div className="col-span-12 flex flex-col gap-4 md:col-span-9">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                {filteredTasks.length} of {tasks.length} task{tasks.length === 1 ? "" : "s"} shown
              </p>
              <Motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEditingTask(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
              >
                <FiPlus className="h-3.5 w-3.5" />
                New task
              </Motion.button>
            </div>
            <KanbanBoard
              tasks={filteredTasks}
              onStatusChange={handleStatusChange}
              onEditTask={(task) => {
                setEditingTask(task);
                setFormOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
            />
          </div>
          <div
            ref={formContainerRef}
            className="col-span-12 flex flex-col gap-4 md:col-span-3"
          >
            <AnimatePresence initial={false}>
              {formOpen && (
                <TaskForm
                  key={editingTask?.id || "new"}
                  open={formOpen}
                  initialTask={editingTask}
                  onSave={handleSaveTask}
                  onClose={() => {
                    setFormOpen(false);
                    setEditingTask(null);
                  }}
                />
              )}
            </AnimatePresence>
            <StatsOverview tasks={statsSourceTasks} />
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200/80 bg-white/80 px-4 py-3 text-xs text-slate-500 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-400 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Omar Ahmed. All rights reserved.</span>
          <span className="hidden text-[11px] sm:inline">
            Stay organised, one task at a time.
          </span>
        </div>
      </footer>
      <ChatbotAssistant tasks={statsSourceTasks} onAddTask={handleAddTaskFromAI} />
    </div>
  );
}

export default App;