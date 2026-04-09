import { useState } from "react";
import AssetSummaryCard from "./AssetSummaryCard";
import { RecentHistorySection } from "./RecentHistorySection";
import BenefitProductSection from "./BenefitProductSection";
import { usePayment } from "../usePayment";
import type {
  PaymentCategory,
  PaymentHistoryItem,
  PaymentProduct,
  PaymentUserSummary,
} from "../payment.types";

type PaymentHomeTabProps = {
  // 부모로부터 받는 user는 무시하고 실제 서버의 data를 사용할 예정입니다.
  user: PaymentUserSummary;
  categories: PaymentCategory[];
  products: PaymentProduct[];
  recentHistory: PaymentHistoryItem[];
  onOpenCoupons: (category?: string | null) => void;
  onOpenHistory: () => void;
};

export default function PaymentHomeTab({
   categories,
   products,
   recentHistory,
   onOpenCoupons,
   onOpenHistory,
 }: PaymentHomeTabProps) {
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  // 2. 서버에서 실시간 잔액(data)과 갱신 함수(refresh)를 가져옵니다.
  const { data, refresh, isLoading } = usePayment();

  // 3. 데이터를 불러오는 중일 때의 UI 처리
  if (isLoading || !data) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
    );
  }

  return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <AssetSummaryCard
              // 4. 서버에서 받아온 실제 잔액과 포인트 데이터를 전달합니다.
              balance={data.user.balance}
              points={data.user.points}
              monthlyUsage={data.user.monthlyUsage}
              onOpenCoupons={onOpenCoupons}
              onRefresh={refresh} // 5. 충전 후 새로고침을 위해 함수 전달
          />
          <RecentHistorySection
              // 만약 Pay 서버의 실제 히스토리(/transactions)를 연결했다면 data.recentHistory를 씁니다.
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
      </div>
  );
}