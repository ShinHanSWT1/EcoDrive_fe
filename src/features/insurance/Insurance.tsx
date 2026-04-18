import { useState } from "react";
import PageHeader from "../../shared/ui/PageSectionHeader";
import { useInsurance } from "./useInsurance";
import InsuranceSummaryCard from "./components/InsuranceSummaryCard";
import InsuranceCompanyList from "./components/InsuranceCompanyList";
import VehicleSelector from "../../shared/ui/VehicleSelector";
import type { MyVehicleResponse } from "../../shared/api/onboarding";

export default function Insurance({
  vehicles,
  selectedUserVehicleId,
  onVehicleChange,
}: {
  vehicles: MyVehicleResponse[];
  selectedUserVehicleId: number | null;
  onVehicleChange: (userVehicleId: number | null) => void;
}) {
  const [showBill, setShowBill] = useState(false);
  const { data, isLoading, isError } = useInsurance(selectedUserVehicleId);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
        보험 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
        보험 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="보험 할인 혜택"
        description="내 주행 데이터로 받을 수 있는 최대 혜택을 확인하세요."
      />

      <VehicleSelector
        vehicles={vehicles}
        selectedUserVehicleId={selectedUserVehicleId}
        onChange={onVehicleChange}
        label="보험 조회 차량"
        disabled={isLoading}
      />

      <InsuranceSummaryCard
        currentSummary={data.currentSummary}
        bill={data.bill}
        showBill={showBill}
        onToggleBill={() => setShowBill((prev) => !prev)}
      />

      <InsuranceCompanyList
        companies={data.companies}
        safetyScore={data.currentSummary.safetyScore}
        selectedUserVehicleId={selectedUserVehicleId}
      />
    </div>
  );
}
