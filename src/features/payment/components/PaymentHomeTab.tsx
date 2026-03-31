import { useState } from "react";
import { AssetSummaryCard } from "./AssetSummaryCard";
import { QuickPayActions } from "./QuickPayActions";
import { RecentHistorySection } from "./RecentHistorySection";
import { PointPromotionCard } from "./PointPromotionCard";
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
};

export default function PaymentHomeTab({
  user,
  categories,
  products,
  recentHistory,
}: PaymentHomeTabProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  return (
    <div className="space-y-8">
      <AssetSummaryCard
        balance={user.balance}
        points={user.points}
        monthlyUsage={user.monthlyUsage}
      />

      <QuickPayActions />

      <RecentHistorySection history={recentHistory} />

      <PointPromotionCard />

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
