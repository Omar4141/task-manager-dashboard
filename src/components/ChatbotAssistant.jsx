import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMessageSquare, FiZap, FiX } from "react-icons/fi";

function fallbackLocalResponse(message, tasks) {
  const lower = message.toLowerCase();

  // Friendly greeting
  if (
    ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"].some(
      (greet) => lower.startsWith(greet) || lower.includes(` ${greet}`)
    )
  ) {
    return "Hello! I'm your productivity assistant. I can help you see what's in progress, find high‑priority work, check what's due soon, or suggest what to work on next.";
  }

  // Friendly goodbye
  if (["bye", "goodbye", "see you", "see ya", "later"].some((word) => lower.includes(word))) {
    return "Got it. I'll be here whenever you want to check your tasks or plan your next steps.";
  }

  // How many tasks are completed?
  if (lower.includes("how many") && lower.includes("completed")) {
    const completed = tasks.filter((t) => t.status === "completed").length;
    return `You have completed ${completed} task${completed === 1 ? "" : "s"} so far.`;
  }

  // Show high priority tasks
  if (lower.includes("high priority")) {
    const high = tasks.filter((t) => t.priority === "High");
    if (high.length === 0)
      return "You don't have any high‑priority tasks yet. Try creating one and marking it as High.";
    return `Here are your high‑priority tasks: ${high
      .map((t) => t.title)
      .join(", ")}.`;
  }

  // What tasks are in progress?
  if (lower.includes("in progress") || lower.includes("in-progress")) {
    const inProgress = tasks.filter((t) => t.status === "in-progress");
    if (inProgress.length === 0)
      return "You don't have any tasks in progress right now. This is a good time to start one.";
    return `These tasks are currently in progress: ${inProgress
      .map((t) => t.title)
      .join(", ")}.`;
  }

  // What should I work on next?
  if (lower.includes("what should i work on") || lower.includes("work on next")) {
    const candidates = tasks
      .filter((t) => t.status !== "completed")
      .sort((a, b) => {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.priority || "Medium"] ?? 1) - (order[b.priority || "Medium"] ?? 1);
      });

    if (candidates.length === 0) {
      return "You don't have any active tasks yet. Create a task with a title, priority, and due date, and I'll help you decide what to do next.";
    }

    const nextTask = candidates[0];
    const dueText = nextTask.dueDate
      ? ` It's due on ${new Date(nextTask.dueDate).toLocaleDateString()}.`
      : "";
    return `I recommend starting with “${nextTask.title}”. It's marked as ${
      nextTask.priority || "Medium"
    } priority.${dueText}`;
  }

  // Tasks due soon (today or tomorrow)
  if (lower.includes("due soon") || lower.includes("due today") || lower.includes("due tomorrow")) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const soon = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return isSameDay(d, today) || isSameDay(d, tomorrow);
    });

    if (soon.length === 0)
      return "You don't have any tasks due today or tomorrow. You're ahead of schedule!";

    const list = soon
      .map((t) => {
        const d = new Date(t.dueDate);
        const label = isSameDay(d, today) ? "today" : "tomorrow";
        return `${t.title} (due ${label})`;
      })
      .join(", ");

    return `Here are the tasks due soon: ${list}.`;
  }

  // Explain what the dashboard does
  if (
    lower.includes("what is this dashboard") ||
    lower.includes("what does this dashboard do") ||
    (lower.includes("what") && lower.includes("dashboard"))
  ) {
    return "This dashboard helps you organize your tasks, track progress, manage priorities, and stay productive by keeping all your work in one place.";
  }

  return "I'm here to help you manage tasks. Try asking things like \"What should I work on next?\", \"Show my high priority tasks\", or \"Do I have any tasks due soon?\".";
}

async function callAssistant(message, tasks) {
  // Placeholder for real Gemini integration. For now, rely on
  // a local heuristic so the UI always renders.
  return {
    action: "query",
    response: fallbackLocalResponse(message, tasks),
  };
}

function ChatbotAssistant({ tasks, onAddTask }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text:
        "Hi! I'm your productivity assistant. I can help you track completed tasks, show high‑priority work, check what's in progress, find anything due soon, and suggest what to work on next.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: String(Date.now()),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await callAssistant(trimmed, tasks);

      if (result.action === "add_task" && result.task && onAddTask) {
        const newTask = {
          title: result.task.title,
          description: result.task.description || "",
          priority: result.task.priority || "Medium",
          status: result.task.status || "todo",
          dueDate: result.task.dueDate || "",
        };
        onAddTask(newTask);
      }

      const reply = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: result.response || "I've updated your board.",
      };
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "I had trouble talking to the AI service. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="fixed bottom-28 right-6 z-40 w-[420px] max-w-[95vw] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/40 dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow-sm shadow-indigo-500/40">
                  <FiZap className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Chatbot
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ask about your tasks, any time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex h-96 flex-col px-4 pb-4 pt-3">
              <div className="relative mb-3 flex-1 overflow-hidden rounded-xl bg-slate-50/80 dark:bg-slate-900/80">
                <div className="absolute inset-0 overflow-y-auto p-4 text-xs md:text-sm leading-relaxed">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <Motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className={`mb-2 flex ${
                          msg.role === "assistant" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                            msg.role === "assistant"
                              ? "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-50"
                              : "bg-indigo-500 text-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </Motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-2 flex items-end gap-2.5">
                <div className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs md:text-sm text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50">
                  <textarea
                    rows={3}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. say hello, what tasks are in progress?"
                    className="h-20 w-full resize-none bg-transparent outline-none"
                  />
                </div>
                <Motion.button
                  type="button"
                  onClick={handleSend}
                  disabled={loading}
                  whileTap={{ scale: loading ? 1 : 0.96 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-[2px] border-white/70 border-t-transparent" />
                  ) : (
                    <FiSend className="h-4 w-4" />
                  )}
                </Motion.button>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] md:text-xs text-slate-400">
                <FiMessageSquare className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span>
                  Try: "Show my high priority tasks" or "How many tasks have I completed?"
                </span>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
      <Motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-xl shadow-indigo-500/40 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        <FiZap className="h-6 w-6" />
      </Motion.button>
    </>
  );
}

export default ChatbotAssistant;
