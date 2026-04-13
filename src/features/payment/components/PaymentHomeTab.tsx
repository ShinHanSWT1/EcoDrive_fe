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
} from "../payment.types";

type PaymentHomeTabProps = {
  user: PaymentUserSummary;
  categories: PaymentCategory[];
  products: PaymentProduct[];
  recentHistory: PaymentHistoryItem[];
  onOpenCoupons: (category?: string | null) => void;
  onOpenHistory: () => void;
  onCharge: (amount: number) => Promise<boolean>;
};

export default function PaymentHomeTab({
                                         user,
                                         categories,
                                         products,
                                         recentHistory,
                                         onOpenCoupons,
                                         onOpenHistory,
                                         onCharge,
                                       }: PaymentHomeTabProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  // 충전 모달 열림/닫힘 상태 관리
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

  return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <AssetSummaryCard
              balance={user.balance}
              points={user.points}
              monthlyUsage={user.monthlyUsage}
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