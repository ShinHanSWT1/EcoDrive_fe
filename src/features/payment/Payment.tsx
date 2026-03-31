import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePayment } from "./usePayment";
import type { PaymentTab } from "./payment.types";
import PaymentHeader from "./components/PaymentHeader";
import PaymentTabs from "./components/PaymentTabs";
import PaymentHomeTab from "./components/PaymentHomeTab";
import PaymentHistoryTab from "./components/PaymentHistoryTab";
import PaymentMissionTab from "./components/PaymentMissionTab";

export default function Payment() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("home");
  const { data, isLoading, isError } = usePayment();

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

  const toggleHomeHistory = () => {
    setActiveTab((prev) => (prev === "home" ? "history" : "home"));
  };

  return (
    <div className="space-y-6">
      <PaymentHeader
        balance={data.user.balance}
        activeTab={activeTab}
        onToggleHomeHistory={toggleHomeHistory}
      />

      <PaymentTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PaymentHomeTab
              user={data.user}
              categories={data.categories}
              products={data.products}
              recentHistory={data.recentHistory}
            />
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PaymentHistoryTab
              historySummary={data.historySummary}
              coupons={data.coupons}
              pointHistory={data.pointHistory}
            />
          </motion.div>
        )}

        {activeTab === "mission" && (
          <motion.div
            key="mission"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PaymentMissionTab
              summary={data.missionSummary}
              missions={data.missions}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
