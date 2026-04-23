import { 
  ShieldCheck, 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  ChevronRight,
  Car,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import DashboardOverview from '../dashboard/components/DashboardOverview';
import SavingsChartCard from '../dashboard/components/SavingsChartCard';
import WalletWidget from '../dashboard/components/WalletWidget';
import DrivingSummaryWidget from '../dashboard/components/DrivingSummaryWidget';
import InsuranceDiscountPreview from '../dashboard/components/InsuranceDiscountPreview';
import { dashboardMockData } from '../dashboard/dashboard.mock';

export default function Landing() {
  const previewData = dashboardMockData;
  const springConfig = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <div className="bg-slate-100 min-h-screen font-sans">

      {/* ─── Hero Section (DB Insurance style) ──────────────────────── */}
      <section className="w-full flex items-center justify-center px-4 md:px-8 lg:px-16 py-16 min-h-screen">
        <div className="w-full max-w-6xl flex flex-col gap-6">

          {/* Green Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.1 }}
            className="relative w-full bg-emerald-500 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/25 flex flex-col lg:flex-row"
            style={{ minHeight: '440px' }}
          >
            {/* Decorative circles */}
            <div className="absolute top-8 right-80 w-28 h-28 border-[10px] border-emerald-400/40 rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 right-72 w-44 h-44 border-[12px] border-emerald-400/30 rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-[38%] w-5 h-5 bg-yellow-300 rotate-45 pointer-events-none" />

            {/* Left: Text */}
            <div className="relative z-10 flex-1 flex flex-col justify-center p-10 md:p-14">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springConfig, delay: 0.25 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2 rounded-full text-sm font-bold mb-8 tracking-wider">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ECODRIVE · ESG AI MOBILITY
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-white leading-snug mb-8 break-keep">
                  안전 운전이<br />
                  ESG 가치가<br />
                  <span className="text-yellow-300">됩니다</span>
                </h1>

                <p className="text-white/80 text-xl md:text-2xl font-medium mb-12 leading-relaxed break-keep">
                  자사 오프라인 대비 인터넷 가입<br />
                  평균 <strong className="text-yellow-300">15.4% 저렴</strong>하게 가입하세요!<br />
                  <span className="text-white/50 text-base">(안전운전 점수 반영 기준)</span>
                </p>

                <div className="flex flex-wrap gap-5">
                  <Link
                    to="/login"
                    className="px-10 py-5 bg-white text-emerald-700 rounded-xl font-black text-2xl shadow-lg hover:bg-yellow-300 hover:text-emerald-900 transition-all hover:scale-105 active:scale-95"
                  >
                    계산 / 가입
                  </Link>
                  <Link
                    to="/dashboard-preview"
                    className="px-10 py-5 bg-white/20 text-white border-2 border-white/40 rounded-xl font-black text-2xl hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
                  >
                    갱신 / 재가입
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right: Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springConfig, delay: 0.4 }}
              className="relative flex-1 min-h-[320px] lg:min-h-0 overflow-hidden"
            >
              <video
                src="/media/background.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Blend edge */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-500/30 to-transparent z-10 pointer-events-none" />
              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-500/50 to-transparent z-10 pointer-events-none" />
              {/* LIVE badge */}
              <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-white text-xs font-black uppercase tracking-widest">실시간 AI 분석 중</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Stats Row (3 cards) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.55 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 flex items-center gap-6 hover:shadow-lg transition-shadow group">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Wallet size={38} />
              </div>
              <div>
                <div className="text-slate-400 text-xl font-bold mb-2">예상 보험료 절감</div>
                <div className="text-4xl font-black text-slate-900 tracking-tight leading-none">854,200원</div>
                <div className="text-emerald-600 text-lg font-bold mt-2">15.4% 할인 적용 중</div>
              </div>
            </div>

            {/* Card 2 - ESG Score */}
            <div className="bg-slate-900 rounded-2xl p-8 shadow-md flex items-center gap-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col flex-1">
                <div className="text-emerald-400 text-base font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                  ESG 에코 드라이빙 지수
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white italic">88.5</span>
                  <span className="text-slate-400 text-lg font-bold">SCORE</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <ShieldCheck size={32} />
                </div>
                <span className="text-sm font-black text-slate-400 uppercase">Top 5%</span>
              </div>
            </div>

            {/* Card 3 - Eco Points */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 flex items-center gap-6 hover:shadow-lg transition-shadow group">
              <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-white transition-colors">
                <TrendingUp size={38} />
              </div>
              <div>
                <div className="text-slate-400 text-xl font-bold mb-2">에코 포인트 적립</div>
                <div className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                  {previewData.pointBalance.toLocaleString("ko-KR")}P
                </div>
                <div className="text-yellow-600 text-lg font-bold mt-2">탄소 절감 기여 누적</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Quick Menu ──────────────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { icon: Car, label: '내 차 연결', path: '/onboarding', color: 'bg-emerald-50 text-emerald-600' },
              { icon: ShieldCheck, label: '보험 할인', path: '/insurance', color: 'bg-blue-50 text-blue-600' },
              { icon: BarChart3, label: '주행 리포트', path: '/report', color: 'bg-orange-50 text-orange-600' },
              { icon: ShoppingBag, label: '포인트 샵', path: '/payment', color: 'bg-indigo-50 text-indigo-600' },
              { icon: Wallet, label: '혜택 관리', path: '/payment', color: 'bg-purple-50 text-purple-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link to={item.path} className="flex flex-col items-center gap-3 group">
                  <div className={`w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all border border-white`}>
                    <item.icon size={30} />
                  </div>
                  <span className="text-sm font-black text-slate-700">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Core Values ─────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              className="text-3xl md:text-4xl font-black text-slate-900 mb-3 break-keep tracking-tight"
            >
              차원이 다른 ESG 주행 분석 솔루션
            </motion.h2>
            <p className="text-slate-500 text-lg font-bold">오직 에코드라이브에서만 가능한 특별한 경험</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: '정밀 주행 리포트', desc: '초단위 데이터 기반의 가장 정확한 주행 분석.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: TrendingUp, title: '보험료 혜택 동기화', desc: '주행 점수 상승 즉시 실시간 보험료 할인 반영.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: ShieldCheck, title: '실시간 가디언 케어', desc: '급가속·급감속 발생 시 즉각적인 맞춤 조언 제공.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: ShoppingBag, title: 'Eco 포인트 보상', desc: '친환경 운전 성과에 따른 현금성 리워드 적립.', color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ ...springConfig, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 break-keep">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed break-keep text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Dashboard Preview ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">직관적인 주행 데이터 경험</h2>
            <p className="text-lg text-slate-500 font-bold">복잡한 데이터도 한눈에 이해하기 쉽게 시각화해 드립니다.</p>
          </div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-8 md:p-16 shadow-xl"
          >
            <DashboardOverview stats={previewData.stats.filter((s: any) => s.id !== "score")} pointBalance={previewData.pointBalance} todayEarnedPoints={previewData.todayEarnedPoints} />
            
            <div className="mt-10 flex flex-col gap-10">
              <div className="flex flex-wrap lg:flex-nowrap gap-10 items-stretch">
                <div className="flex-1 min-w-0 max-w-[800px]">
                  <SavingsChartCard chartData={previewData.savingsChart} />
                </div>
                <div className="w-full lg:w-[400px] flex-shrink-0">
                  <WalletWidget
                    pointBalance={previewData.pointBalance}
                    todayEarnedPoints={previewData.todayEarnedPoints}
                  />
                </div>
              </div>
              <div className="w-full">
                <DrivingSummaryWidget
                  summaryNote={previewData.summaryNote}
                  todayDrivingSummary={previewData.todayDrivingSummary}
                />
              </div>
            </div>

            <div className="mt-10">
              <InsuranceDiscountPreview items={previewData.insurancePreviews} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────── */}
      <section className="py-28 bg-emerald-600 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[200px] translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter break-keep"
          >
            지금 바로 에코 드라이버로<br />전환하고 혜택을 받으세요!
          </motion.h2>
          <p className="text-white/70 mb-12 text-xl font-bold">
            가입 없이 체험부터 시작해 보세요.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-3 px-14 py-5 bg-white text-emerald-700 rounded-2xl font-black text-xl shadow-2xl hover:bg-yellow-300 hover:text-emerald-900 transition-all hover:scale-105 active:scale-95"
          >
            무료 체험 시작하기 <ChevronRight size={24} />
          </Link>
        </div>
      </section>

    </div>
  );
}
