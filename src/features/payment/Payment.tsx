import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePayment } from "./usePayment";
import type { PaymentTab } from "./payment.types";
import PaymentHeader from "./components/PaymentHeader";
import PaymentTabs from "./components/PaymentTabs";
import PaymentHomeTab from "./components/PaymentHomeTab";
import PaymentMissionTab from "./components/PaymentMissionTab";
import CouponListModal from "./components/CouponListModal";
import HistoryModal from "./components/HistoryModal";

export default function Payment() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("home");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedCouponCategory, setSelectedCouponCategory] = useState<string | null>(null);
  const { data, isLoading, isError, handleCharge, handleCreateWallet, isCreatingWallet } = usePayment();

  const handleOpenCoupons = (category: string | null = null) => {
    setSelectedCouponCategory(category);
    setIsCouponModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
        payment 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
        payment 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <PaymentHeader />
        <PaymentTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PaymentHomeTab
              user={data.user}
              categories={data.categories}
              products={data.products}
              recentHistory={data.recentHistory}
              walletMissing={data.walletMissing}
              isCreatingWallet={isCreatingWallet}
              onCreateWallet={handleCreateWallet}
              onOpenCoupons={handleOpenCoupons}
              onOpenHistory={() => setIsHistoryModalOpen(true)}
              onCharge={handleCharge}
            />
          </motion.div>
        ) : (
          <motion.div
            key="mission"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PaymentMissionTab summary={data.missionSummary} missions={data.missions} />
          </motion.div>
        )}
      </AnimatePresence>

      <CouponListModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        coupons={data.coupons}
        initialCategory={selectedCouponCategory}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={data.recentHistory}
      />
    </div>
  );
}
