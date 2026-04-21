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
 <div className="flex bg-slate-100 p-1.5 rounded-[24px] w-fit border border-slate-200/50">
 <button
 onClick={() => onChangeTab("home")}
 className={cn(
 "px-10 py-3 rounded-[20px] text-sm font-black transition-all duration-300",
 activeTab === "home"
 ? "bg-white text-slate-900 -200/50"
 : "text-slate-400 hover:text-slate-600",
 )}
 >
 홈
 </button>
 <button
 onClick={() => onChangeTab("mission")}
 className={cn(
 "px-10 py-3 rounded-[20px] text-sm font-black transition-all duration-300",
 activeTab === "mission"
 ? "bg-white text-slate-900 -200/50"
 : "text-slate-400 hover:text-slate-600",
 )}
 >
 미션
 </button>
 </div>
 );
}
