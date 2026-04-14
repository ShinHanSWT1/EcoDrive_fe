import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Filter, History, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../shared/lib/utils";
import type { PaymentHistoryItem } from "../payment.types";

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  history: PaymentHistoryItem[];
};

export default function HistoryModal({
  isOpen,
  onClose,
  history,
}: HistoryModalProps) {
  const [filterType, setFilterType] = useState<"all" | "earn" | "pay">("all");
  const filteredHistory = history.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType; // "earn" 또는 "pay"만 통과
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">전체 이용내역</h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  최근 결제와 적립 내역을 확인하세요.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
              <button className="w-full h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center gap-2 text-sm font-bold">
                <Search size={16} /> 검색
              </button>

              {/* 새롭게 추가된 필터 탭 버튼들 */}
              <div className="flex gap-2">
                <button
                    onClick={() => setFilterType("all")}
                    className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                        filterType === "all" ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-500"
                    )}
                >
                  전체
                </button>
                <button
                    onClick={() => setFilterType("earn")}
                    className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                        filterType === "earn" ? "bg-emerald-500 text-white shadow-md" : "bg-slate-100 text-slate-500"
                    )}
                >
                  충전
                </button>
                <button
                    onClick={() => setFilterType("pay")}
                    className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                        filterType === "pay" ? "bg-slate-800 text-white shadow-md" : "bg-slate-100 text-slate-500"
                    )}
                >
                  결제
                </button>
              </div>
            </div>

            <div className="overflow-y-auto">
              {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                      <div
                          key={item.id}
                          className="px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                              className={cn(
                                  "w-11 h-11 rounded-2xl flex items-center justify-center",
                                  item.type === "earn"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-slate-100 text-slate-600",
                              )}
                          >
                            {item.type === "earn" ? (
                                <ArrowDownLeft size={18} />
                            ) : (
                                <ArrowUpRight size={18} />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{item.title}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {item.date} · {item.category}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                              className={cn(
                                  "font-black",
                                  item.type === "earn" ? "text-emerald-600" : "text-slate-900",
                              )}
                          >
                            {item.type === "earn" ? "+" : "-"}
                            {item.amount.toLocaleString("ko-KR")}원
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1 flex items-center gap-1 justify-end">
                            <History size={10} />
                            {item.type === "earn" ? "Earn" : "Pay"}
                          </div>
                        </div>
                      </div>
                  ))
              ) : (
                  <div className="py-12 text-center text-slate-400 text-sm font-medium">
                    해당하는 내역이 없습니다.
                  </div>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}