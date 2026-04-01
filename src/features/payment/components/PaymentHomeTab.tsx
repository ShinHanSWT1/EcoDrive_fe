import { useState } from "react";
import AssetSummaryCard from "./AssetSummaryCard";
import { QuickPayActions } from "./QuickPayActions";
import { RecentHistorySection } from "./RecentHistorySection";
import { ServiceGuideSection } from "./ServiceGuideSection";
import BenefitProductSection from "./BenefitProductSection";
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
};

export default function PaymentHomeTab({
  user,
  categories,
  products,
  recentHistory,
  onOpenCoupons,
  onOpenHistory,
}: PaymentHomeTabProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <AssetSummaryCard
          balance={user.balance}
          points={user.points}
          monthlyUsage={user.monthlyUsage}
          onOpenCoupons={onOpenCoupons}
        />
        <RecentHistorySection history={recentHistory.slice(0, 4)} onViewAll={onOpenHistory} />
      </div>

      <QuickPayActions />
      <ServiceGuideSection />

      <BenefitProductSection
        categories={categories}
        products={products}
        activeCategoryId={activeCategoryId}
        onChangeCategory={setActiveCategoryId}
      />
    </div>
  );
}
