import { Activity, ChevronDown, History, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type { MonthOption, ScoreChangeListItem } from "../driving.types";

interface SafetyScoreHistoryCardProps {
  monthOptions: MonthOption[];
  selectedMonthKey: string;
  items: ScoreChangeListItem[];
  onMonthChange: (monthKey: string) => void;
}

export function SafetyScoreHistoryCard({
  monthOptions,
  selectedMonthKey,
  items,
  onMonthChange,
}: SafetyScoreHistoryCardProps) {
  const visibleItems = items;
  const orderedMonthOptions = [...monthOptions].sort((left, right) =>
    left.key.localeCompare(right.key),
  );

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 pb-5 pt-6">
        <div className="flex min-h-[52px] items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <History size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">최근 점수 변화</h3>
              <p className="mt-1 text-xs font-medium text-slate-400">
                선택한 월 기준으로 점수 변화 이력을 확인합니다.
              </p>
            </div>
          </div>
          <MonthSelect
            monthOptions={orderedMonthOptions}
            selectedMonthKey={selectedMonthKey}
            onMonthChange={onMonthChange}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 px-6 pb-6 pt-4">
        {visibleItems.length > 0 ? (
          <div className="max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-0">
              {visibleItems.map((item, index) => (
                <ScoreChangeRow
                  key={item.fullDate}
                  item={item}
                  isLast={index === visibleItems.length - 1}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function MonthSelect({
  monthOptions,
  selectedMonthKey,
  onMonthChange,
}: {
  monthOptions: MonthOption[];
  selectedMonthKey: string;
  onMonthChange: (monthKey: string) => void;
}) {
  return (
    <label className="relative shrink-0">
      <span className="sr-only">최근 점수 변화 월 선택</span>
      <select
        value={selectedMonthKey}
        onChange={(event) => onMonthChange(event.target.value)}
        className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white pl-4 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      >
        {monthOptions.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </label>
  );
}

function ScoreChangeRow({
  item,
  isLast,
}: {
  item: ScoreChangeListItem;
  isLast: boolean;
}) {
  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "mt-1 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm",
            item.isToday ? "bg-blue-500" : "bg-slate-300",
          )}
        />
        {isLast ? null : <div className="mt-2 w-px flex-1 bg-slate-200" />}
      </div>

      <div
        className={cn(
          "rounded-2xl border px-4 py-3 transition",
          item.isToday ? "border-blue-200 bg-blue-50/50" : "border-slate-100 bg-white",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                {item.dateLabel}
              </div>
              {item.isToday ? (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  TODAY
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-sm font-semibold leading-5 text-slate-900">
              {item.summary}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <DeltaBadge delta={item.deltaFromPrevious} />
            <div className="mt-2 flex items-end justify-end gap-1">
              <div className="text-xl font-black text-slate-900">{item.score}</div>
              <div className="pb-0.5 text-[11px] font-bold text-slate-400">점</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
        비교 기준 없음
      </div>
    );
  }

  if (delta === 0) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
        변동 없음
      </div>
    );
  }

  const isPositive = delta > 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black",
        isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
      )}
    >
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {isPositive ? "+" : ""}
      {delta}점
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
      <div>
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
          <Activity size={18} />
        </div>
        <div className="mt-4 text-sm font-semibold text-slate-700">
          선택한 월에는 점수 변화 이력이 없습니다
        </div>
        <div className="mt-1 text-xs font-medium text-slate-400">
          다른 월을 선택해 다시 확인해 보세요.
        </div>
      </div>
    </div>
  );
}
