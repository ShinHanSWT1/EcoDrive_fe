import { ArrowDownLeft, ArrowUpRight, ChevronRight, History } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import type { PaymentHistoryItem } from "../payment.types";

type RecentHistorySectionProps = {
 history: PaymentHistoryItem[];
 onViewAll: () => void;
};

export function RecentHistorySection({
 history,
 onViewAll,
}: RecentHistorySectionProps) {
 return (
 <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden h-full flex flex-col">
 <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
 <div>
 <h4 className="font-black text-slate-900 flex items-center gap-2 text-base">
 <History size={18} className="text-blue-600" /> 최근 이용내역
 </h4>
 <p className="text-[10px] text-slate-400 font-medium mt-0.5">
 최근 4건의 내역을 확인하세요
 </p>
 </div>
 <button
 onClick={onViewAll}
 className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all"
 >
 전체보기 <ChevronRight size={12} />
 </button>
 </div>
 <div className="divide-y divide-slate-50 flex-1 overflow-y-auto">
 {history.length === 0 ? (
 <div className="p-6 text-sm text-slate-400">최근 거래내역이 없습니다.</div>
 ) : (
 history.map((item) => (
 <div
 key={item.id}
 className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
 >
 <div className="flex items-center gap-3">
 <div
 className={cn(
 "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ",
 item.type === "earn"
 ? "bg-emerald-50 text-emerald-600"
 : "bg-slate-100 text-slate-600",
 )}
 >
 {item.type === "earn" ? (
 <ArrowDownLeft size={16} />
 ) : (
 <ArrowUpRight size={16} />
 )}
 </div>
 <div>
 <div className="font-bold text-slate-900 text-sm">{item.title}</div>
 <div className="text-[11px] text-slate-400 font-medium mt-0.5">
 {item.date} · {item.category}
 </div>
 {item.description ? (
 <div className="text-[11px] text-slate-500 mt-1">{item.description}</div>
 ) : null}
 </div>
 </div>
 <div
 className={cn(
 "text-sm font-black",
 item.type === "earn" ? "text-emerald-600" : "text-slate-900",
 )}
 >
 {item.type === "earn" ? "+" : "-"}
 {item.amount.toLocaleString("ko-KR")}원
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 );
}
