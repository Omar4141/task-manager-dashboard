import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

function FilterDropdown({ label, valueLabel, items, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (item) => {
    onChange?.(item.value);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400/80 dark:hover:bg-slate-800"
      >
        <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <span className="text-sm text-slate-700 dark:text-slate-100">
          {valueLabel}
        </span>
        <FiChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute right-0 z-30 mt-1.5 w-48 rounded-xl border border-slate-100 bg-white py-2 text-sm shadow-xl shadow-slate-200/80 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/70"
          >
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item)}
                className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-200 ${
                  item.active
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200"
                    : "text-slate-600 dark:text-slate-200"
                }`}
              >
                {item.dotClass && (
                  <span
                    className={`h-2 w-2 rounded-full ${item.dotClass}`}
                    aria-hidden="true"
                  />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterDropdown;
