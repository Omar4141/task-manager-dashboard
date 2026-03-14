import { motion as Motion} from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-slate-300 bg-slate-100 px-1 text-slate-700 shadow-sm transition hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
    >
      <Motion.div
        layout
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-800 shadow-md dark:bg-slate-900 dark:text-yellow-300"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ x: isDark ? 24 : 0 }}
      >
        {isDark ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
      </Motion.div>
    </button>
  );
}

export default ThemeToggle;
