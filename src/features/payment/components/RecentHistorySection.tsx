import {
  History,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { cn } from "../../../shared/lib/utils";

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  amount: number;
  type: "pay" | "earn";
  category: string;
}

interface RecentHistorySectionProps {
  history: HistoryItem[];
}

export function RecentHistorySection({ history }: RecentHistorySectionProps) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h4 className="font-bold text-slate-900 flex items-center gap-2">
          <History size={18} className="text-slate-400" /> 최근 이용내역
        </h4>
        <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
          전체보기 <ChevronRight size={14} />
        </button>
      </div>
      <div className="divide-y divide-slate-50">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                  item.type === "earn"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                {item.type === "earn" ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownLeft size={20} />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {item.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "text-sm font-black",
                item.type === "earn" ? "text-emerald-600" : "text-slate-900",
              )}
            >
              {item.type === "earn" ? "+" : ""}
              {item.amount.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-50">
        이전 내역 더보기
      </button>
    </div>
  );
}
