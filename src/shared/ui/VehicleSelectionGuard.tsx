import type { ReactNode } from "react";

export default function VehicleSelectionGuard({
  isLoading,
  isError,
  selectedUserVehicleId,
  loadingMessage,
  errorMessage,
  allowEmptySelection = false,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  selectedUserVehicleId: number | null;
  loadingMessage: string;
  errorMessage: string;
  allowEmptySelection?: boolean;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">
        {loadingMessage}
      </div>
    );
  }

  if (isError || (!allowEmptySelection && selectedUserVehicleId == null)) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
        {errorMessage}
      </div>
    );
  }

  return <>{children}</>;
}
