import { TrendingUp, TrendingDown, History } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type { ScoreHistoryItem } from "../driving.types";

interface SafetyScoreHistoryCardProps {
  items: ScoreHistoryItem[];
}

export function SafetyScoreHistoryCard({ items }: SafetyScoreHistoryCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History size={18} className="text-slate-400" />
          <h3 className="font-bold text-lg">최근 점수 변화</h3>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          최근 10건
        </div>
      </div>

      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    item.type === "up"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600",
                  )}
                >
                  {item.type === "up" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {item.reason}
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    {item.date}
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "text-sm font-black",
                  item.type === "up" ? "text-emerald-600" : "text-red-600",
                )}
              >
                {item.type === "up" ? "+" : "-"}
                {item.change}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-500">
            --
          </div>
        )}
      </div>
    </div>
  );
}
