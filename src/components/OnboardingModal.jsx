import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

function OnboardingModal({ isOpen, onSubmit }) {
  const [form, setForm] = useState({ name: "", age: "", gender: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      name: form.name.trim(),
      age: form.age.trim(),
      gender: form.gender.trim(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-md rounded-2xl bg-slate-900 text-slate-50 shadow-2xl ring-1 ring-slate-700/80"
          >
            <div className="border-b border-slate-700/80 px-6 py-4">
              <h2 className="text-lg font-semibold tracking-tight">
                Welcome to Task Manager Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Please submit the information below before we get started.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 px-6 py-5 text-sm"
            >
              <div className="space-y-1.5">
                <label className="font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-medium" htmlFor="age">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Continue
                </button>
              </div>
            </form>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default OnboardingModal;
