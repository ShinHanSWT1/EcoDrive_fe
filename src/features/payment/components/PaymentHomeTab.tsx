import { useState } from "react";
import AssetSummaryCard from "./AssetSummaryCard";
import { RecentHistorySection } from "./RecentHistorySection";
import BenefitProductSection from "./BenefitProductSection";
import ChargeModal from "./ChargeModal";
import type {
  PaymentCategory,
  PaymentHistoryItem,
  PaymentProduct,
  PaymentUserSummary,
  PaymentWalletInfo,
} from "../payment.types";

type PaymentHomeTabProps = {
  user: PaymentUserSummary;
  wallet: PaymentWalletInfo | null;
  walletMissing: boolean;
  isCreatingWallet: boolean;
  categories: PaymentCategory[];
  products: PaymentProduct[];
  recentHistory: PaymentHistoryItem[];
  onCreateWallet: () => Promise<boolean>;
  onOpenCoupons: (category?: string | null) => void;
  onOpenHistory: () => void;
  onCharge: (amount: number) => Promise<boolean>;
};

export default function PaymentHomeTab({
  user,
  wallet,
  walletMissing,
  isCreatingWallet,
  categories,
  products,
  recentHistory,
  onCreateWallet,
  onOpenCoupons,
  onOpenHistory,
  onCharge,
}: PaymentHomeTabProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  return (
    <div className="space-y-12">
      {walletMissing ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-amber-900 font-semibold">
            계좌가 연결되어 있지 않습니다. 계좌를 생성하세요.
          </p>
          <button
            onClick={onCreateWallet}
            disabled={isCreatingWallet}
            className="rounded-xl bg-amber-500 px-4 py-2 text-white font-semibold disabled:opacity-60"
          >
            {isCreatingWallet ? "계좌 생성 중..." : "계좌를 생성하세요"}
          </button>
        </div>
      ) : wallet ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500">계좌번호</p>
            <p className="text-sm font-semibold text-slate-900">{wallet.accountNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">예금주</p>
            <p className="text-sm font-semibold text-slate-900">{wallet.ownerName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">은행코드</p>
            <p className="text-sm font-semibold text-slate-900">{wallet.bankCode ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">상태</p>
            <p className="text-sm font-semibold text-slate-900">{wallet.status}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <AssetSummaryCard
          balance={user.balance}
          points={user.points}
          monthlyUsage={user.monthlyUsage}
          chargeDisabled={walletMissing}
          onOpenCoupons={onOpenCoupons}
          onChargeClick={() => setIsChargeModalOpen(true)}
        />
        <RecentHistorySection
          history={recentHistory.slice(0, 4)}
          onViewAll={onOpenHistory}
        />
      </div>

      <BenefitProductSection
        categories={categories}
        products={products}
        activeCategoryId={activeCategoryId}
        onChangeCategory={setActiveCategoryId}
      />

      <ChargeModal
        isOpen={isChargeModalOpen}
        onClose={() => setIsChargeModalOpen(false)}
        onCharge={onCharge}
      />
    </div>
  );
}
