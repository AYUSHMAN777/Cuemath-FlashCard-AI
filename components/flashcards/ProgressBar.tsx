type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const percentage = (safeCurrent / safeTotal) * 100;

  return (
    <div className="mx-auto mb-5 w-full max-w-2xl">
      <div className="mb-1 flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
        <span className="font-medium">Progress</span>
        <span>
          {safeCurrent} / {safeTotal}
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

