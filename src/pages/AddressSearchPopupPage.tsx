import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { searchAddress } from "../shared/api/address";
import type { AddressResult } from "../shared/api/address";

type AddressMessage = {
 type: "ECODRIVE_ADDRESS_SELECTED";
 payload: AddressResult;
};

export default function AddressSearchPopupPage() {
 const [keyword, setKeyword] = useState("");
 const [results, setResults] = useState<AddressResult[]>([]);
 const [selected, setSelected] = useState<AddressResult | null>(null);
 const [isLoading, setIsLoading] = useState(false);

 const handleSearch = async () => {
 if (!keyword.trim()) return;
 setIsLoading(true);
 try {
 const items = await searchAddress(keyword.trim());
 setResults(items);
 setSelected(items[0] ?? null);
 } catch (error) {
 console.error("[주소검색] 검색 실패", error);
 alert("주소 검색에 실패했습니다.");
 } finally {
 setIsLoading(false);
 }
 };

 const handleConfirm = () => {
 if (!selected) {
 alert("적용할 주소를 선택해 주세요.");
 return;
 }

 if (window.opener && !window.opener.closed) {
 const message: AddressMessage = {
 type: "ECODRIVE_ADDRESS_SELECTED",
 payload: selected,
 };
 window.opener.postMessage(message, window.location.origin);
 }
 window.close();
 };

 return (
 <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5 py-6">
 <div className="w-full max-w-xl space-y-4 -translate-y-8">
 <div className="rounded-2xl border border-slate-200 bg-white p-4">
 <div className="flex gap-2">
 <input
 type="text"
 value={keyword}
 onChange={(event) => setKeyword(event.target.value)}
 onKeyDown={(event) => event.key === "Enter" && handleSearch()}
 placeholder="예) 판교역로 166, 분당 주공, 백현동 532"
 className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-700 focus:outline-none focus:border-[#FF5C35]"
 />
 <button
 onClick={handleSearch}
 className="rounded-xl bg-slate-800 px-4 py-3 text-white hover:bg-slate-700"
 >
 {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
 </button>
 </div>
 </div>

 {results.length > 0 && (
 <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
 <div className="max-h-[360px] overflow-y-auto">
 {results.map((item, index) => {
 const isSelected = selected?.roadAddr === item.roadAddr && selected?.zipNo === item.zipNo;
 return (
 <button
 key={`${item.zipNo}-${index}`}
 onClick={() => setSelected(item)}
 className={`w-full text-left px-5 py-4 border-b border-slate-100 last:border-none transition-colors ${
 isSelected ? "bg-blue-50" : "hover:bg-slate-50"
 }`}
 >
 <p className="font-semibold text-slate-800">{item.roadAddr}</p>
 <p className="text-xs text-slate-500 mt-1">[{item.zipNo}] {item.jibunAddr}</p>
 </button>
 );
 })}
 </div>
 </div>
 )}

 <div className="flex justify-end gap-2">
 <button
 onClick={() => window.close()}
 className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600"
 >
 취소
 </button>
 <button
 onClick={handleConfirm}
 className="rounded-xl bg-[#FF5C35] px-5 py-3 font-semibold text-white hover:bg-[#ff4c20]"
 >
 확인
 </button>
 </div>
 </div>
 </div>
 );
}
