import { Coins, CreditCard, Plus, Ticket, TrendingUp, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { chargeMoney } from "../payment.api";
import { useState } from "react";
import ChargeModal from "./chargemodal";

// props에 onRefresh(데이터 새로고침용) 추가를 권장합니다.
interface AssetSummaryCardProps {
  balance: number;
  points: number;
  monthlyUsage: number;
  onOpenCoupons: () => void;
  onRefresh: () => void;
}

export default function AssetSummaryCard({
  balance,
  points,
  monthlyUsage,
  onOpenCoupons,
  onRefresh,
}: AssetSummaryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 충전 버튼 클릭 핸들러
  const handleChargeSubmit = async (amount: number) => {
    try {
      await chargeMoney(amount); // 모달에서 선택한 금액만큼 서버에 요청
      alert(`${amount.toLocaleString()}원이 성공적으로 충전되었습니다! 🎉`);
      if (onRefresh) onRefresh(); // 메인 화면 잔액 새로고침
    } catch (err) {
      alert("충전 실패: 서버 연결을 확인하세요.");
      throw err; // 에러를 던져서 모달의 로딩 상태를 해제
    }
  };

  const totalBalance = balance + points;

  return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-blue-600 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group h-full flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl border border-white/30">
                <Wallet size={28} />
              </div>
              <div className="text-right">
                <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">
                  이번 달 총 사용액
                </div>
                <div className="text-lg font-black flex items-center justify-end gap-1">
                  {monthlyUsage.toLocaleString("ko-KR")}원
                  <TrendingUp size={16} className="text-emerald-300" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mb-8">
              <div className="text-[11px] text-white/80 font-black uppercase tracking-widest">
                현재 PAY 총 잔액
              </div>
              <div className="text-5xl font-black tracking-tighter text-white drop-shadow-md">
                {totalBalance.toLocaleString("ko-KR")}
                <span className="text-3xl ml-1">원</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-2">
                  <Coins size={18} className="text-amber-300" />
                  <span className="text-sm font-bold">{points.toLocaleString("ko-KR")}P</span>
                </div>
                <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-200" />
                  <span className="text-sm font-bold">{balance.toLocaleString("ko-KR")}원</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 mt-8">
            {/* 클릭 시 모달 열기 함수(setIsModalOpen) 연결 */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-slate-900 rounded-2xl px-4 py-3 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
            >
              <Plus size={16} />
              충전하기
            </button>

            <button
                onClick={onOpenCoupons}
                className="bg-white/10 backdrop-blur-md text-white rounded-2xl px-4 py-3 font-black text-sm flex items-center justify-center gap-2 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <Ticket size={16} />
              쿠폰함
            </button>
          </div>
        </motion.div>
        {/* 모달 컴포넌트 렌더링 (isOpen이 true일 때만 화면에 보임) */}
        <ChargeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCharge={handleChargeSubmit}
        />
      </>
  );
}
