import { cn } from "../../../shared/lib/utils";
import type { PaymentTab } from "../payment.types";

type PaymentTabsProps = {
  activeTab: PaymentTab;
  onChangeTab: (tab: PaymentTab) => void;
};

export default function PaymentTabs({
  activeTab,
  onChangeTab,
}: PaymentTabsProps) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
      <button
        onClick={() => onChangeTab("home")}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-bold transition-all",
          activeTab === "home"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        홈
      </button>

      <button
        onClick={() => onChangeTab("history")}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-bold transition-all",
          activeTab === "history"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        이용 내역
      </button>

      <button
        onClick={() => onChangeTab("mission")}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-bold transition-all",
          activeTab === "mission"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700",
        )}
      >
        미션
      </button>
    </div>
  );
}
