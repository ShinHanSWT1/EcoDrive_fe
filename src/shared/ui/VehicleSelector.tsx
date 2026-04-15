import type { MyVehicleResponse } from "../api/onboarding";

interface VehicleSelectorProps {
  vehicles: MyVehicleResponse[];
  selectedUserVehicleId: number | null;
  onChange: (userVehicleId: number) => void;
  label?: string;
  disabled?: boolean;
}

export default function VehicleSelector({
  vehicles,
  selectedUserVehicleId,
  onChange,
  label = "차량 선택",
  disabled = false,
}: VehicleSelectorProps) {
  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:min-w-72">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <select
        value={selectedUserVehicleId ?? ""}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        {vehicles.map((vehicle) => (
          <option key={vehicle.userVehicleId} value={vehicle.userVehicleId}>
            {vehicle.manufacturer} {vehicle.modelName} · {vehicle.vehicleNumber}
          </option>
        ))}
      </select>
    </div>
  );
}
