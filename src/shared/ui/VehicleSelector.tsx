import type { MyVehicleResponse } from "../api/onboarding";

interface VehicleSelectorProps {
 vehicles: MyVehicleResponse[];
 selectedUserVehicleId: number | null;
 onChange: (userVehicleId: number | null) => void;
 label?: string;
 disabled?: boolean;
 includeIntegratedOption?: boolean;
}

const EMPTY_SELECTION_VALUE = "";

export default function VehicleSelector({
 vehicles,
 selectedUserVehicleId,
 onChange,
 label = "차량 선택",
 disabled = false,
 includeIntegratedOption = false,
}: VehicleSelectorProps) {
 if (vehicles.length === 0) {
 return null;
 }

 const selectedValue = selectedUserVehicleId?.toString() ?? EMPTY_SELECTION_VALUE;

 function handleChange(value: string) {
 if (includeIntegratedOption && value === EMPTY_SELECTION_VALUE) {
 onChange(null);
 return;
 }

 if (!value) {
 return;
 }

 const nextUserVehicleId = Number.parseInt(value, 10);
 if (Number.isNaN(nextUserVehicleId)) {
 return;
 }

 onChange(nextUserVehicleId);
 }

 return (
 <div className="flex flex-col gap-2 sm:min-w-72">
 <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
 {label}
 </label>
 <select
 value={selectedValue}
 onChange={(event) => handleChange(event.target.value)}
 disabled={disabled}
 className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:ring-2 focus:ring-[#1A5D40] focus:border-[#1A5D40] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
 >
 {includeIntegratedOption ? (
 <option value={EMPTY_SELECTION_VALUE}>전체 차량 (통합)</option>
 ) : null}
 {selectedUserVehicleId == null && !includeIntegratedOption ? (
 <option value={EMPTY_SELECTION_VALUE} disabled>
 차량을 선택해 주세요
 </option>
 ) : null}
 {vehicles.map((vehicle) => (
 <option key={vehicle.userVehicleId} value={vehicle.userVehicleId}>
 {vehicle.manufacturer} {vehicle.modelName} · {vehicle.vehicleNumber}
 </option>
 ))}
 </select>
 </div>
 );
}
