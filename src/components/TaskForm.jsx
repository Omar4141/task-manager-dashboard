import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import FilterDropdown from "./FilterDropdown.jsx";

function TaskForm({ open, initialTask, onSave, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "todo",
    dueDate: "",
  });

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || "",
        description: initialTask.description || "",
        priority: initialTask.priority || "Medium",
        status: initialTask.status || "todo",
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        status: "todo",
        dueDate: "",
      });
    }
  }, [initialTask, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...initialTask,
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : "",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/80 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-slate-900/40"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {initialTask ? "Edit task" : "New task"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capture the essentials and keep momentum.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-100 p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-3 text-sm"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 dark:border-slate-700 dark:bg-slate-900"
                placeholder="e.g. Finish dashboard layout"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Optional details, links, or notes"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" htmlFor="priority">
                  Priority
                </label>
                <FilterDropdown
                  label="Priority"
                  valueLabel={form.priority}
                  items={[
                    {
                      value: "Low",
                      label: "Low priority",
                      dotClass: "bg-emerald-400 dark:bg-emerald-300",
                      active: form.priority === "Low",
                    },
                    {
                      value: "Medium",
                      label: "Medium priority",
                      dotClass: "bg-amber-400 dark:bg-amber-300",
                      active: form.priority === "Medium",
                    },
                    {
                      value: "High",
                      label: "High priority",
                      dotClass: "bg-rose-400 dark:bg-rose-300",
                      active: form.priority === "High",
                    },
                  ]}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, priority: value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" htmlFor="status">
                  Status
                </label>
                <FilterDropdown
                  label="Status"
                  valueLabel={
                    form.status === "todo"
                      ? "To Do"
                      : form.status === "in-progress"
                      ? "In Progress"
                      : "Completed"
                  }
                  items={[
                    {
                      value: "todo",
                      label: "To Do",
                      active: form.status === "todo",
                    },
                    {
                      value: "in-progress",
                      label: "In Progress",
                      active: form.status === "in-progress",
                    },
                    {
                      value: "completed",
                      label: "Completed",
                      active: form.status === "completed",
                    },
                  ]}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, status: value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" htmlFor="dueDate">
                Due date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition appearance-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="text-xs text-slate-400">
                Tip: drag tasks between columns to update status.
              </div>
              <Motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/40 transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              >
                {initialTask ? "Save changes" : "Create task"}
              </Motion.button>
            </div>
          </form>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default TaskForm;
