import { 
 LayoutDashboard, 
 Users, 
 ShieldCheck, 
 Settings, 
 ShoppingBag, 
 TrendingUp,
 Search,
 Filter,
 MoreVertical,
 ArrowUpRight,
 ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../shared/lib/utils';

const stats = [
 { label: '전체 사용자', value: '1,245명', change: '+12%', trend: 'up' },
 { label: '평균 안전 점수', value: '82.4점', change: '+2.1점', trend: 'up' },
 { label: '총 포인트 발행', value: '1,542,000P', change: '-5%', trend: 'down' },
 { label: '보험 할인 총액', value: '1.2억원', change: '+15%', trend: 'up' },
];

const users = [
 { id: 1, name: '김철수', email: 'chulsoo@gmail.com', score: 92, car: '아반떼', status: 'Active' },
 { id: 2, name: '이영희', email: 'younghee@naver.com', score: 78, car: '쏘렌토', status: 'Active' },
 { id: 3, name: '박민수', email: 'minsoo@kakao.com', score: 85, car: '그랜저', status: 'Pending' },
 { id: 4, name: '최지우', email: 'jiwoo@outlook.com', score: 95, car: '모델3', status: 'Active' },
];

export default function Admin() {
 return (
 <div className="space-y-8">
 <section className="flex justify-between items-center">
 <div>
 <h2 className="text-2xl font-bold text-slate-900">관리자 대시보드</h2>
 <p className="text-slate-500">서비스 운영 현황 및 정책을 관리합니다.</p>
 </div>
 <div className="flex gap-2">
 <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold">데이터 내보내기</button>
 <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold -200">새 정책 등록</button>
 </div>
 </section>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 {stats.map((stat, i) => (
 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 ">
 <div className="text-sm text-slate-400 font-bold mb-1">{stat.label}</div>
 <div className="text-2xl font-black text-slate-900">{stat.value}</div>
 <div className={cn(
 "text-xs font-bold mt-2 flex items-center gap-1",
 stat.trend === 'up' ? "text-green-600" : "text-red-500"
 )}>
 {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
 {stat.change}
 </div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* User Management Table */}
 <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden">
 <div className="p-6 border-b border-slate-50 flex justify-between items-center">
 <h3 className="font-bold text-lg">사용자 관리</h3>
 <div className="flex gap-2">
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 <input 
 type="text" 
 placeholder="사용자 검색..." 
 className="bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
 />
 </div>
 <button className="p-2 bg-slate-50 text-slate-500 rounded-xl">
 <Filter size={18} />
 </button>
 </div>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
 <th className="px-6 py-4">사용자</th>
 <th className="px-6 py-4">차량</th>
 <th className="px-6 py-4">안전 점수</th>
 <th className="px-6 py-4">상태</th>
 <th className="px-6 py-4 text-right">관리</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {users.map((user) => (
 <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs">
 {user.name[0]}
 </div>
 <div>
 <div className="text-sm font-bold">{user.name}</div>
 <div className="text-[10px] text-slate-400">{user.email}</div>
 </div>
 </div>
 </td>
 <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.car}</td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div className="h-full bg-blue-500" style={{ width: `${user.score}%` }}></div>
 </div>
 <span className="text-xs font-bold text-slate-700">{user.score}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className={cn(
 "text-[10px] font-bold px-2 py-1 rounded-md",
 user.status === 'Active' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
 )}>
 {user.status}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <button className="p-1 text-slate-300 hover:text-slate-600">
 <MoreVertical size={18} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="p-4 bg-slate-50/50 text-center">
 <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">전체 사용자 보기</button>
 </div>
 </div>

 {/* Policy Management */}
 <div className="space-y-6">
 <div className="bg-white p-6 rounded-3xl border border-slate-200 ">
 <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
 <ShieldCheck size={20} className="text-blue-600" /> 보험 할인 정책
 </h3>
 <div className="space-y-4">
 {[
 { name: '안전운전 특약', value: '최대 15%', active: true },
 { name: '커넥티드카 연동', value: '고정 3%', active: false },
 ].map((policy, i) => (
 <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
 <div>
 <div className="text-sm font-bold">{policy.name}</div>
 <div className="text-[10px] text-blue-600 font-bold">{policy.value}</div>
 </div>
 <div className={cn(
 "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
 policy.active ? "bg-blue-600" : "bg-slate-300"
 )}>
 <div className={cn(
 "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
 policy.active ? "right-1" : "left-1"
 )}></div>
 </div>
 </div>
 ))}
 </div>
 <button className="w-full mt-6 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
 정책 설정 상세
 </button>
 </div>

 <div className="bg-white p-6 rounded-3xl border border-slate-200 ">
 <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
 <ShoppingBag size={20} className="text-purple-600" /> 포인트 상품 관리
 </h3>
 <div className="space-y-3">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
 <div className="flex-1">
 <div className="text-xs font-bold">GS칼텍스 주유권</div>
 <div className="text-[10px] text-slate-400">재고: 142개</div>
 </div>
 <div className="text-xs font-bold text-slate-900">4,500P</div>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
 <div className="flex-1">
 <div className="text-xs font-bold">모두의주차장 할인</div>
 <div className="text-[10px] text-slate-400">재고: 85개</div>
 </div>
 <div className="text-xs font-bold text-slate-900">2,400P</div>
 </div>
 </div>
 <button className="w-full mt-6 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">
 상품 전체 관리
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}
