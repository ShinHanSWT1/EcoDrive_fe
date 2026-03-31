import { 
  User, 
  Car, 
  ShieldCheck, 
  Bell, 
  Lock, 
  LogOut, 
  ChevronRight, 
  CreditCard,
  History,
  Settings,
  Database,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../shared/lib/utils';

export default function Profile() {
  const profileCompletion = 70;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-xl">
            <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
            <Settings size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">홍길동</h2>
        <p className="text-slate-500 text-sm">hong@example.com</p>
      </section>

      {/* Profile Completion */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">프로필 완성도</div>
            <div className="text-xl font-black text-slate-900">{profileCompletion}%</div>
          </div>
          <div className="text-xs font-bold text-blue-600">30% 더 채우고 정확한 혜택 받기</div>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${profileCompletion}%` }}
            className="h-full bg-blue-600 rounded-full"
          />
        </div>
        
        {profileCompletion < 100 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
            <AlertCircle size={18} className="text-blue-600 shrink-0" />
            <p className="text-xs text-blue-800 font-medium">
              보험 갱신일을 입력하면 <span className="font-bold underline">다음 달 예상 할인액</span>을 더 정확하게 계산할 수 있습니다.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center flex sm:flex-col justify-between sm:justify-center items-center sm:items-center px-6 sm:px-4">
          <div className="text-[10px] text-slate-400 font-bold uppercase sm:mb-1">내 포인트</div>
          <div className="text-lg font-black text-blue-600">12,540</div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center flex sm:flex-col justify-between sm:justify-center items-center sm:items-center px-6 sm:px-4">
          <div className="text-[10px] text-slate-400 font-bold uppercase sm:mb-1">내 쿠폰</div>
          <div className="text-lg font-black text-slate-900">3</div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-200 text-center flex sm:flex-col justify-between sm:justify-center items-center sm:items-center px-6 sm:px-4">
          <div className="text-[10px] text-slate-400 font-bold uppercase sm:mb-1">안전 등급</div>
          <div className="text-lg font-black text-green-600">A+</div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">내 정보 관리</h3>
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <MenuItem icon={Car} label="차량 정보 수정" subLabel="현대 아반떼 (12가 3456)" />
            <MenuItem icon={ShieldCheck} label="보험 정보 수정" subLabel="현대해상 다이렉트 (갱신일 미입력)" alert />
            <MenuItem icon={Database} label="주행 데이터 연동 설정" subLabel="현대 커넥티드 서비스 연동 중" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">활동 및 설정</h3>
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <MenuItem icon={History} label="포인트/쿠폰 내역" />
            <MenuItem icon={History} label="주행 리포트 히스토리" />
            <MenuItem icon={Bell} label="알림 설정" subLabel="푸시 알림 ON" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4">기타</h3>
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <MenuItem icon={Lock} label="보안 및 개인정보 보호" />
            <MenuItem icon={LogOut} label="로그아웃" color="text-red-500" />
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-[10px] text-slate-300 font-medium uppercase tracking-widest">EcoDrive Payback v1.0.5</p>
      </div>
    </div>
  );
}

function MenuItem({ 
  icon: Icon, 
  label, 
  subLabel, 
  color = "text-slate-700",
  alert = false
}: { 
  icon: any, 
  label: string, 
  subLabel?: string,
  color?: string,
  alert?: boolean
}) {
  return (
    <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color.replace('text', 'bg').replace('500', '50'))}>
          <Icon size={20} className={color} />
        </div>
        <div className="text-left">
          <div className={cn("text-sm font-bold flex items-center gap-2", color)}>
            {label}
            {alert && <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
          </div>
          {subLabel && <div className={cn("text-[10px] font-medium", alert ? "text-red-400" : "text-slate-400")}>{subLabel}</div>}
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
    </button>
  );
}
