import { useState } from "react";
import { DndContext, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const STATUSES = [
  { id: "todo", label: "To Do", accent: "border-amber-400/70" },
  {
    id: "in-progress",
    label: "In Progress",
    accent: "border-sky-400/70",
  },
  { id: "completed", label: "Completed", accent: "border-emerald-400/70" },
];

function KanbanBoard({ tasks, onStatusChange, onEditTask, onDeleteTask }) {
  const [activeId, setActiveId] = useState(null);

  const activeTask =
    activeId != null ? tasks.find((task) => task.id === activeId) : null;

  const handleDragStart = (event) => {
    setActiveId(event.active?.id ?? null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active) {
      setActiveId(null);
      return;
    }
    const taskId = active.id;
    const newStatus = over.id;
    if (!STATUSES.find((s) => s.id === newStatus)) {
      setActiveId(null);
      return;
    }
    onStatusChange(taskId, newStatus);
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            tasks={tasks.filter((t) => t.status === status.id)}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCardPreview task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ status, tasks, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });

  return (
    <div className="flex min-h-[500px] w-full flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-slate-900/40">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-8 rounded-full bg-gradient-to-r from-slate-500 via-indigo-400 to-sky-300`}
          />
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
            {status.label}
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600 dark:bg-slate-800/90 dark:text-slate-200">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`mt-2 flex flex-1 flex-col gap-2 rounded-xl border border-dashed ${
          isOver
            ? "border-indigo-400/80 bg-indigo-50/70 dark:border-indigo-400/80 dark:bg-indigo-500/10"
            : "border-slate-200/70 bg-slate-50/40 dark:border-slate-700/70 dark:bg-slate-900/40"
        } p-2 transition-colors`}
      >
        {tasks.length === 0 && (
          <p className="pt-4 text-center text-sm text-slate-400 dark:text-slate-500">
            Drop tasks here
          </p>
        )}
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

function DraggableTaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` ,
      }
    : undefined;

  const priorityColor = {
    Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    Medium:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    High: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
  }[task.priority || "Medium"];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      layout
      className={`group cursor-grab rounded-2xl border border-slate-200 bg-white/90 p-3.5 text-sm shadow-sm shadow-slate-200 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-slate-900/60 ${
        isDragging ? "z-20 shadow-xl ring-2 ring-indigo-400 opacity-0" : ""
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h4 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {task.title}
          </h4>
          {task.description && (
            <p className="line-clamp-3 text-xs text-slate-500 dark:text-slate-400">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor}`}
          >
            {task.priority || "Medium"}
          </span>
          {task.dueDate && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800/80 dark:text-slate-300">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {task.status === "completed" ? "Done" : "Active"}
        </span>
        <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <FiEdit2 className="h-3 w-3" />
          </button>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-full bg-slate-100 p-1 text-rose-500 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-900/60"
          >
            <FiTrash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TaskCardPreview({ task }) {
  const priorityColor = {
    Low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    Medium:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    High: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
  }[task.priority || "Medium"];

  return (
    <motion.div
      layout
      className="group cursor-grabbing rounded-2xl border border-slate-200 bg-white p-3.5 text-sm shadow-xl shadow-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h4 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {task.title}
          </h4>
          {task.description && (
            <p className="line-clamp-3 text-xs text-slate-500 dark:text-slate-400">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor}`}
          >
            {task.priority || "Medium"}
          </span>
          {task.dueDate && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800/80 dark:text-slate-300">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {task.status === "completed" ? "Done" : "Active"}
        </span>
      </div>
    </motion.div>
  );
}

export default KanbanBoard;
