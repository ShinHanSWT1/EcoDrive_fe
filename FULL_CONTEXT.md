# EcoDrive Payback - Full Project Context

This document contains the project specification and the core source code for the EcoDrive Payback application, specifically focused on the recent UI refactoring for annual insurance renewals and responsive navigation.

---

## 1. Project Specification

### Project Overview
- **Name**: EcoDrive Payback
- **Description**: A data-driven mobility platform that connects driving behavior (Safety/Eco scores) with car insurance premium discounts.
- **Core Philosophy**: Focus on **Insurance Renewal Benefits** (Annual) rather than monthly rewards. Points and missions are secondary motivators.

### UI/UX Architecture
- **Responsive Design**:
  - **Desktop**: Header-based navigation with a "More" menu for secondary features (Challenge, Admin).
  - **Mobile**: Bottom tab bar (Home, Report, Insurance, Pay, My).
- **Layout Types**:
  - `AppLayout`: For general users (Header, Main, Footer).
  - `AdminLayout`: For administrators (Sidebar-based).
- **PageContainer**: Consistent max-width (1280px) and padding for all content.

### Navigation Structure
1. **Home (Dashboard)**: Overview of driving scores, next renewal premium, and cumulative savings.
2. **Report**: Detailed driving analysis (Safety/Eco scores, events, trends).
3. **Insurance**: Insurance comparison, next renewal premium calculation, and discount rate tracking.
4. **Pay (Shop)**: Insurance premium payment hub, point usage, and lifestyle benefits.
5. **My (Profile)**: User settings and vehicle information.

### Key Features & Logic
- **Insurance Renewal Focus**: All premium-related terminology is centered around the **"Next Renewal"** period.
- **Key Metrics**:
  - **Estimated Premium at Next Renewal**: Projected cost based on current driving habits.
  - **Cumulative Estimated Savings**: Total discount accumulated since the last renewal.
  - **Discount Rate Trend**: Visualizing how driving behavior impacts future costs.
- **Onboarding Flow**: Simplified to Vehicle Registration (auto-lookup) and Insurance Info.
- **Pay-Centric Shop**: A hub for insurance payments and point-based lifestyle benefits.

---

## 2. Core Application Logic

### src/App.tsx
```tsx
import { useState, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Insurance from './pages/Insurance';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Admin from './pages/Admin';
import Challenge from './pages/Challenge';
import Landing from './pages/Landing';

function LayoutWrapper({ children, isAuthenticated, onLogout }: { children: ReactNode, isAuthenticated: boolean, onLogout: () => void }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AdminLayout onLogout={onLogout}>{children}</AdminLayout>;
  }

  return (
    <AppLayout isAuthenticated={isAuthenticated} onLogout={onLogout}>
      {children}
    </AppLayout>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <Router>
      <LayoutWrapper isAuthenticated={isAuthenticated} onLogout={logout}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Landing />} />
          <Route path="/report" element={isAuthenticated ? <Report /> : <Navigate to="/login" />} />
          <Route path="/insurance" element={isAuthenticated ? <Insurance /> : <Navigate to="/login" />} />
          <Route path="/shop" element={isAuthenticated ? <Shop /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mission" element={isAuthenticated ? <Mission /> : <Navigate to="/login" />} />
          <Route path="/dashboard-preview" element={<Dashboard />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
```

---

## 3. Layouts & Navigation

### src/layouts/AppLayout.tsx
```tsx
import { ReactNode } from 'react';
import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';
import MobileTabBar from '../components/navigation/MobileTabBar';
import PageContainer from '../components/layout/PageContainer';

interface AppLayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function AppLayout({ children, isAuthenticated, onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="flex-1 py-6 md:py-12 pb-24 md:pb-16">
        <PageContainer>
          {children}
        </PageContainer>
      </main>
      <Footer />
      {isAuthenticated && <MobileTabBar />}
    </div>
  );
}
```

### src/components/navigation/Header.tsx
```tsx
import { Link } from 'react-router-dom';
import { Bell, ShieldCheck, User } from 'lucide-react';
import HeaderNav from './HeaderNav';
import MoreMenu from './MoreMenu';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Header({ isAuthenticated, onLogout }: HeaderProps) {
  return (
    <header className="h-16 md:h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck size={20} className="text-white md:size-24" />
          </div>
          <span className="text-lg md:text-xl font-black text-slate-900 tracking-tight">EcoDrive Payback</span>
        </Link>
        {isAuthenticated && <HeaderNav />}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {isAuthenticated ? (
          <>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/profile" className="hidden md:flex items-center gap-3 p-1 pr-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all">
              <div className="w-8 h-8 bg-slate-200 rounded-xl overflow-hidden">
                <img src="https://picsum.photos/seed/user/100/100" alt="Profile" />
              </div>
              <span className="text-xs font-bold text-slate-700">홍길동님</span>
            </Link>
            <MoreMenu onLogout={onLogout} />
          </>
        ) : (
          <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
```

---

## 4. Main Pages

### src/pages/Dashboard.tsx
```tsx
import { TrendingUp, TrendingDown, Car, Wallet, Zap, ChevronRight, ShieldCheck, Leaf, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: '1주', savings: 132000 },
  { name: '2주', savings: 138000 },
  { name: '3주', savings: 145000 },
  { name: '4주', savings: 154200 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">대시보드</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
          <p className="text-slate-500">현재까지 누적 예상 절감액 <span className="text-blue-600 font-bold">155,800원</span>입니다.</p>
          <div className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
            포인트 혜택 별도 적립 (12,540P)
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 text-white rounded-2xl"><ShieldCheck size={24} /></div>
          </div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">다음 갱신 시 예상 보험료</div>
          <div className="text-2xl font-black mt-1">854,200원</div>
          <div className="text-[11px] text-blue-400 font-bold mt-2">지난달 대비 예상 할인율 +1.2%p</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Wallet size={24} /></div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">+2.4%</span>
          </div>
          <div className="text-sm text-slate-500 font-medium">현재 예상 할인율</div>
          <div className="text-3xl font-bold mt-1">15.4%</div>
          <div className="text-xs text-orange-600 font-bold mt-2">현재까지 누적 예상 절감액 155,800원</div>
        </motion.div>
        {/* ... Other Stats ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">예상 절감 효과 변화</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip formatter={(value: any) => [`${value.toLocaleString()}원`, '누적 예상 절감액']} />
                <Area type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### src/pages/Insurance.tsx
```tsx
import { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, FileText, Download, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Receipt, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Insurance() {
  const [showBill, setShowBill] = useState(false);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-slate-900">보험 할인 혜택</h2>
        <p className="text-slate-500">내 주행 데이터로 받을 수 있는 최대 혜택을 확인하세요.</p>
      </section>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <div className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">현재 가입 보험</div>
            <div className="text-xl font-bold">현대해상 다이렉트 자동차보험</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">갱신일</div>
            <div className="text-xl font-bold">D-45</div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-slate-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-sm text-slate-500 font-medium mb-1">다음 갱신 시 예상 보험료</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">854,200원</span>
                <span className="text-sm font-bold text-blue-600">(-15.4%)</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">현재까지 누적 예상 절감액 155,800원</p>
            </div>
            <button onClick={() => setShowBill(!showBill)} className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200">
              예상 보험료 산출서 보기 {showBill ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>
      {/* ... Comparison and Guides ... */}
    </div>
  );
}
```

### src/pages/Report.tsx
```tsx
import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, MapPin, AlertTriangle, Calendar, ChevronRight, ChevronLeft, Info, Leaf, ShieldCheck, Zap, Navigation } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const weeklyData = [
  { day: '월', distance: 12.4, score: 85, eco: 80 },
  { day: '화', distance: 8.2, score: 92, eco: 88 },
  { day: '수', distance: 15.1, score: 78, eco: 75 },
  { day: '목', distance: 10.5, score: 88, eco: 85 },
  { day: '금', distance: 22.3, score: 82, eco: 80 },
  { day: '토', distance: 45.0, score: 95, eco: 92 },
  { day: '일', distance: 32.1, score: 90, eco: 94 },
];

export default function DrivingReport() {
  return (
    <div className="space-y-6 pb-12">
      <section className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">주행 분석 리포트</h2>
          <p className="text-slate-500 font-medium">2026년 3월 3주차 분석 결과입니다.</p>
        </div>
      </section>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">다음 갱신 기준 예상 혜택 변화</h3>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="score" name="예상 할인율" radius={[4, 4, 0, 0]} barSize={24}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#3b82f6' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

### src/pages/Shop.tsx
```tsx
import { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Zap, 
  CreditCard,
  Tag,
  ChevronRight,
  Clock,
  History,
  Ticket,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const categories = [
  { id: 'all', label: '전체' },
  { id: 'fuel', label: '주유/충전' },
  { id: 'parking', label: '주차장' },
  { id: 'wash', label: '세차' },
  { id: 'maintenance', label: '정비/부품' },
];

const products = [
  { id: 1, name: 'GS칼텍스 5,000원 주유권', price: '4,500', originalPrice: '5,000', category: 'fuel', image: 'https://picsum.photos/seed/fuel/400/300', discount: '10%' },
  { id: 2, name: '모두의주차장 3,000원 할인권', price: '2,400', originalPrice: '3,000', category: 'parking', image: 'https://picsum.photos/seed/parking/400/300', discount: '20%' },
  { id: 3, name: '컴인워시 노터치 세차권', price: '12,000', originalPrice: '15,000', category: 'wash', image: 'https://picsum.photos/seed/wash/400/300', discount: '20%' },
  { id: 4, name: '오토오아시스 엔진오일 교환권', price: '45,000', originalPrice: '65,000', category: 'maintenance', image: 'https://picsum.photos/seed/maint/400/300', discount: '30%' },
  { id: 5, name: 'S-OIL 10,000원 주유권', price: '9,500', originalPrice: '10,000', category: 'fuel', image: 'https://picsum.photos/seed/soil/400/300', discount: '5%' },
  { id: 6, name: '아이파킹 1일 주차권', price: '15,000', originalPrice: '20,000', category: 'parking', image: 'https://picsum.photos/seed/iparking/400/300', discount: '25%' },
];

const pointHistory = [
  { id: 1, title: '3월 안전운전 보너스 적립', date: '2026.03.25', amount: '+2,450', type: 'earn' },
  { id: 2, title: 'GS칼텍스 주유권 구매', date: '2026.03.22', amount: '-4,500', type: 'use' },
  { id: 3, title: '에코드라이빙 챌린지 달성', date: '2026.03.15', amount: '+1,200', type: 'earn' },
  { id: 4, title: '신규 가입 축하 포인트', date: '2026.03.01', amount: '+5,000', type: 'earn' },
];

export default function Shop() {
  const [activeTab, setActiveTab] = useState<'pay' | 'history' | 'mission'>('pay');

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pay/결제</h2>
          <p className="text-slate-500">보험료 결제와 생활형 혜택 결제를 지원하는 통합 Pay 서비스입니다.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">사용 가능 Pay 잔액</div>
              <div className="text-xl font-black text-slate-900">12,540 P</div>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <button 
            onClick={() => setActiveTab(activeTab === 'pay' ? 'history' : 'pay')}
            className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline transition-all"
          >
            {activeTab === 'pay' ? '내역 보기' : '결제 홈'} <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('pay')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'pay' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          결제
        </button>
        <button 
          onClick={() => setActiveTab('mission')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'mission' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          챌린지
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'history' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          이용 내역
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pay' && (
          <motion.div 
            key="pay"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Insurance Premium Payment Section - Main Feature */}
            <div className="bg-slate-900 rounded-[40px] p-8 md:p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <ShieldCheck size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-bold text-blue-400">이번 달 보험료 결제</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">자동 청구 예약됨</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                  <div>
                    <div className="text-slate-400 text-sm font-bold mb-1">4월 청구 예정 금액</div>
                    <div className="text-4xl font-black mb-6">84,200원</div>
                    
                    <div className="space-y-3 bg-white/5 p-6 rounded-3xl border border-white/10">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">기본 보험료</span>
                        <span className="font-bold">102,500원</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-400">안전운전 할인 (15%)</span>
                        <span className="font-bold text-blue-400">- 15,375원</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-emerald-400">에코 포인트 사용</span>
                        <span className="font-bold text-emerald-400">- 2,925원</span>
                      </div>
                      <div className="h-px bg-white/10 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-bold">최종 결제 예정</span>
                        <span className="text-xl font-black text-white">84,200원</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-slate-800/50 rounded-3xl flex flex-col items-center justify-center text-center border border-white/5 backdrop-blur-sm">
                      <div className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-widest">Billing Schedule</div>
                      <div className="text-lg font-bold mb-4">4월 15일 자동 결제 예정</div>
                      <div className="w-full bg-white/5 text-slate-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/5 cursor-default">
                        해당 일에 자동 청구됩니다
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed px-4">
                      보유하신 Pay 포인트는 결제 시 자동으로 우선 차감됩니다. <br />
                      결제 수단 변경은 마이페이지에서 가능합니다.
                    </p>
                  </div>
                </div>
              </div>
              <CreditCard size={240} className="absolute -bottom-20 -right-20 text-white/5 -rotate-12" />
            </div>

            {/* Lifestyle Benefits Section - Secondary */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">생활형 혜택 결제</h3>
                  <p className="text-sm text-slate-500">Pay 포인트로 결제 가능한 제휴 서비스입니다.</p>
                </div>
                <button className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  전체 사용처 보기 <ChevronRight size={14} />
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                      cat.id === 'all' 
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                        : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div 
                    key={product.id}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                        {product.discount} SAVE
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{product.category}</div>
                      <h4 className="font-bold text-slate-800 mb-4 line-clamp-1">{product.name}</h4>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xs text-slate-400 line-through">{product.originalPrice} P</div>
                          <div className="text-xl font-black text-slate-900">{product.price} P</div>
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all">
                          결제하기
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'mission' && (
          <motion.div 
            key="mission"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Zap size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">진행 중인 챌린지</h3>
                  <p className="text-blue-100 text-sm mb-8">안전운전하고 Pay 포인트를 추가로 적립하세요.</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold">에코드라이빙 챌린지</span>
                        <span className="text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">진행중</span>
                      </div>
                      <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                        <div className="bg-white h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-blue-100">
                        <span>6.5km / 10km</span>
                        <span>65%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Zap size={180} className="absolute -bottom-10 -right-10 text-white/10 -rotate-12" />
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600">
                    <History size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">지난 챌린지 결과</h3>
                  <p className="text-slate-500 text-sm mb-6">최근 30일 동안 3개의 챌린지를 성공했습니다.</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                        🏆
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-slate-600">총 4,500 P 적립 완료</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 px-2">참여 가능한 새로운 챌린지</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: '심야 운전 주의 챌린지', reward: '1,500 P', icon: <Clock size={20} />, color: 'bg-indigo-50 text-indigo-600' },
                  { title: '주말 무사고 챌린지', reward: '2,000 P', icon: <ShieldCheck size={20} />, color: 'bg-emerald-50 text-emerald-600' },
                  { title: '급가속 금지 챌린지', reward: '1,200 P', icon: <Zap size={20} />, color: 'bg-orange-50 text-orange-600' },
                  { title: '정속 주행 챌린지', reward: '1,800 P', icon: <ArrowRight size={20} />, color: 'bg-blue-50 text-blue-600' },
                ].map((challenge, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-300 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", challenge.color)}>
                        {challenge.icon}
                      </div>
                      <div className="text-sm font-black text-slate-900">{challenge.reward}</div>
                    </div>
                    <h5 className="font-bold text-slate-800 mb-1">{challenge.title}</h5>
                    <p className="text-[10px] text-slate-400 font-bold">참여 기간: 2026.04.01 - 04.07</p>
                    <button className="w-full mt-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl group-hover:bg-blue-600 transition-all">
                      참여하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Monthly Settlement Summary */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">3월 Pay 이용 리포트</h3>
                    <p className="text-xs text-slate-500 font-bold">2026.03.01 - 2026.03.26</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">총 적립 Pay</div>
                  <div className="text-2xl font-black text-blue-600">+ 8,650 P</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <div className="text-[10px] text-blue-600 font-bold uppercase mb-2">주행 보너스 적립</div>
                  <div className="text-xl font-black text-slate-900">+ 5,450 P</div>
                  <div className="text-[10px] text-blue-500 font-bold mt-1">안전/에코 주행 실적 보상</div>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">결제 사용</div>
                  <div className="text-xl font-black text-slate-900">- 4,500 P</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-1">보험료 및 혜택 결제</div>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">기타 적립</div>
                  <div className="text-xl font-black text-slate-900">+ 3,200 P</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-1">챌린지 및 이벤트 참여</div>
                </div>
              </div>
            </div>

            {/* My Coupons Section - Moved here and themed to match */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Tag size={20} className="text-blue-600" /> 보유 중인 결제 쿠폰
                </h3>
                <button className="text-xs text-slate-400 font-bold hover:text-blue-600 transition-colors">전체 보기</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: '주유 5,000원 할인권', expiry: '2026.04.12', used: false },
                  { name: '공영주차장 1시간 무료', expiry: '2026.03.30', used: false },
                ].map((coupon, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-3xl flex items-center justify-between border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Ticket size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{coupon.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={10} /> 만료일: {coupon.expiry}
                        </div>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      사용
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Detailed History List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <History size={18} className="text-slate-400" /> 상세 결제/이용 내역
                </h4>
                <div className="flex gap-2">
                  <button className="text-xs font-bold text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200">전체</button>
                  <button className="text-xs font-bold text-slate-500 px-3 py-1.5 rounded-lg">적립</button>
                  <button className="text-xs font-bold text-slate-500 px-3 py-1.5 rounded-lg">결제</button>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {pointHistory.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        item.type === 'earn' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {item.type === 'earn' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{item.date}</div>
                      </div>
                    </div>
                    <div className={cn(
                      "text-sm font-black",
                      item.type === 'earn' ? "text-emerald-600" : "text-slate-900"
                    )}>
                      {item.amount} P
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors border-t border-slate-50">
                이전 내역 더보기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```
