import { ShieldCheck } from 'lucide-react';

export default function Footer() {
 return (
 <footer className="bg-white border-t border-slate-200 py-12 md:py-16 mt-auto">
 <div className="max-w-[1400px] mx-auto px-4 md:px-12">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
 <div className="space-y-4">
 <div className="flex items-center gap-2">
 <img src="/media/logo5.png" alt="EcoDrive" className="w-10 h-10 object-contain" />
 <span className="text-lg font-black text-slate-400 tracking-tight">EcoDrive</span>
 </div>
 <p className="text-sm text-slate-400 max-w-md leading-relaxed">
 데이터로 보험료를 줄이는 안전운전 및 탄소 절감 리워드 서비스. <br />
 안전운전과 친환경 주행으로 더 큰 혜택을 누려보세요.
 </p>
 </div>
 
 <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold text-slate-400">
 <a href="#" className="hover:text-slate-600 transition-colors">이용약관</a>
 <a href="#" className="hover:text-slate-600 transition-colors">개인정보처리방침</a>
 <a href="#" className="hover:text-slate-600 transition-colors">고객센터</a>
 <a href="#" className="hover:text-slate-600 transition-colors">제휴문의</a>
 </div>
 </div>
 
 <div className="h-px bg-slate-100 my-8"></div>
 
 <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
 <span>© 2026 DRIVING INSIGHT. ALL RIGHTS RESERVED.</span>
 <div className="flex items-center gap-4">
 <span>DESIGNED FOR BETTER DRIVING</span>
 <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
 <span>POWERED BY DATA</span>
 </div>
 </div>
 </div>
 </footer>
 );
}
