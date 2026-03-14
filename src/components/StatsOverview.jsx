import { useMemo } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

function StatsOverview({ tasks }) {
  const { total, completed, inProgress } = useMemo(() => {
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
    return {
      total: totalCount,
      completed: completedCount,
      inProgress: inProgressCount,
    };
  }, [tasks]);

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const chartData = [
    {
      name: "Progress",
      value: progress,
      fill: "url(#progressGradient)",
    },
  ];

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/80 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-slate-900/40">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Today&apos;s overview
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Track progress across your board at a glance.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200">
          {progress}% done
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              barSize={12}
              data={chartData}
              startAngle={220}
              endAngle={-40}
            >
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                dataKey="value"
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={999}
                clockWise
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
            <span className="text-slate-500 dark:text-slate-300">
              Total tasks
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {total}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-900/40">
            <span className="text-emerald-700 dark:text-emerald-200">
              Completed
            </span>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
              {completed}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-sky-50 px-3 py-2 dark:bg-sky-900/40">
            <span className="text-sky-700 dark:text-sky-200">
              In progress
            </span>
            <span className="text-sm font-semibold text-sky-700 dark:text-sky-200">
              {inProgress}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
