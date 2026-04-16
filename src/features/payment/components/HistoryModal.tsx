import { useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [periodType, setPeriodType] = useState<"all" | "7d" | "30d" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const parseHistoryDate = (dateText: string): Date | null => {
    const normalized = dateText.replace(/\./g, "-");
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const normalizedKeyword = searchQuery.trim().toLowerCase();
  const normalizedMinAmount = minAmount.trim() === "" ? null : Number(minAmount);
  const normalizedMaxAmount = maxAmount.trim() === "" ? null : Number(maxAmount);

  const filteredHistory = useMemo(() => {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(base);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const thirtyDaysAgo = new Date(base);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const customStart = startDate ? new Date(startDate) : null;
    const customEnd = endDate ? new Date(endDate) : null;
    if (customEnd) {
      customEnd.setHours(23, 59, 59, 999);
    }

    return history.filter((item) => {
      if (filterType !== "all" && item.type !== filterType) {
        return false;
      }

      if (normalizedKeyword) {
        const target = `${item.title} ${item.category}`.toLowerCase();
        if (!target.includes(normalizedKeyword)) {
          return false;
        }
      }

      const itemDate = parseHistoryDate(item.date);
      if (periodType !== "all") {
        if (!itemDate) {
          return false;
        }
        if (periodType === "7d" && itemDate < sevenDaysAgo) {
          return false;
        }
        if (periodType === "30d" && itemDate < thirtyDaysAgo) {
          return false;
        }
        if (periodType === "custom") {
          if (customStart && itemDate < customStart) {
            return false;
          }
          if (customEnd && itemDate > customEnd) {
            return false;
          }
        }
      }

      if (normalizedMinAmount !== null && !Number.isNaN(normalizedMinAmount) && item.amount < normalizedMinAmount) {
        return false;
      }
      if (normalizedMaxAmount !== null && !Number.isNaN(normalizedMaxAmount) && item.amount > normalizedMaxAmount) {
        return false;
      }

      return true;
    });
  }, [
    history,
    filterType,
    normalizedKeyword,
    periodType,
    startDate,
    endDate,
    normalizedMinAmount,
    normalizedMaxAmount,
  ]);

  const resetFilters = () => {
    setFilterType("all");
    setSearchQuery("");
    setPeriodType("all");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
  };

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
              <label className="w-full h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center gap-2 text-sm font-bold px-3">
                <Search size={16} />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="내역명/카테고리 검색"
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </label>

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

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setPeriodType("all")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all",
                    periodType === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  전체기간
                </button>
                <button
                  onClick={() => setPeriodType("7d")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all",
                    periodType === "7d" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  최근 7일
                </button>
                <button
                  onClick={() => setPeriodType("30d")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all",
                    periodType === "30d" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  최근 30일
                </button>
                <button
                  onClick={() => setPeriodType("custom")}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all",
                    periodType === "custom" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  직접선택
                </button>
              </div>

              {periodType === "custom" ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none"
                  />
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={minAmount}
                  onChange={(event) => setMinAmount(event.target.value)}
                  placeholder="최소 금액"
                  className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <input
                  type="number"
                  min={0}
                  value={maxAmount}
                  onChange={(event) => setMaxAmount(event.target.value)}
                  placeholder="최대 금액"
                  className="h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">검색 결과 {filteredHistory.length}건</p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  필터 초기화
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
