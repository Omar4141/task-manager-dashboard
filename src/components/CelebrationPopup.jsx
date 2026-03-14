import { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

function fireConfetti() {
  const duration = 1.2 * 1000;
  const animationEnd = Date.now() + duration;

  function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      ticks: 180,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      ticks: 180,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}

function CelebrationPopup({ isOpen, userName, onClose }) {
  useEffect(() => {
    if (isOpen) {
      fireConfetti();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-600 p-[1px] shadow-[0_0_40px_rgba(56,189,248,0.7)]"
          >
            <div className="relative rounded-3xl bg-slate-950/90 px-6 py-6 text-center text-slate-50">
              <div className="pointer-events-none absolute -inset-16 opacity-60">
                <div className="animate-pulse-slow absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,230,217,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.35),_transparent_55%)]" />
              </div>
              <div className="relative space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300/90">
                  Task Completed
                </p>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Good job{userName ? ", " : ""}
                  {userName || "there"}! Keep going!
                </h3>
                <p className="text-sm text-slate-300">
                  Every completed task is a step closer to your goals.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Yesss!
                  </button>
                </div>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default CelebrationPopup;
