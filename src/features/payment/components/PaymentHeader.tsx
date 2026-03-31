import { ChevronRight, Wallet } from "lucide-react";

type PaymentHeaderProps = {
  balance: number;
  activeTab: "home" | "history" | "mission";
  onToggleHomeHistory: () => void;
};

export default function PaymentHeader({
  balance,
  activeTab,
  onToggleHomeHistory,
}: PaymentHeaderProps) {
  return (
    <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pay 홈</h2>
        <p className="text-sm md:text-base text-slate-500">
          내 자산을 관리하고 다양한 혜택을 결제하세요.
        </p>
      </div>

      <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between sm:justify-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              사용 가능 Pay 잔액
            </div>
            <div className="text-lg md:text-xl font-black text-slate-900">
              {balance.toLocaleString("ko-KR")}원
            </div>
          </div>
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-100" />

        <button
          onClick={onToggleHomeHistory}
          className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline transition-all whitespace-nowrap"
        >
          {activeTab === "home" ? "내역 보기" : "결제 홈"}{" "}
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
}
