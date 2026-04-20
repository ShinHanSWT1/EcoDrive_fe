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
import DashboardSidePanel from '../dashboard/components/DashboardSidePanel';
import InsuranceDiscountPreview from '../dashboard/components/InsuranceDiscountPreview';
import { dashboardMockData } from '../dashboard/dashboard.mock';

export default function Landing() {
  const previewData = dashboardMockData;

  // spring animation config
  const springConfig = { type: "spring" as const, stiffness: 300, damping: 20 };

  return (
    <div className="bg-[#f4f7f6] min-h-screen overflow-hidden font-sans">
      {/* Hero Section - DB Style */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#f4f7f6]">
        <div className="w-full h-full px-6 md:px-12 lg:px-20 xl:px-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="relative z-20 text-left lg:col-span-6 2xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springConfig, delay: 0.1 }}
            >
              <div className="inline-block px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-black mb-8 shadow-xl shadow-blue-600/20 tracking-widest">
                ECODRIVE : AI MOBILITY
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-black text-slate-900 leading-tight mb-10 tracking-tighter break-keep">
                운전의 가치를 <br />
                <span className="text-blue-600">수익</span>으로 바꾸다
              </h1>
              <p className="text-lg md:text-xl xl:text-2xl text-slate-500 font-bold mb-12 leading-relaxed break-keep max-w-3xl">
                에코드라이브는 당신의 안전 주행 습관을 실시간 분석하여 <br className="hidden md:block" />
                즉각적인 보험료 할인과 풍성한 혜택을 제공합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
                <Link to="/login" className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-xl shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                  서비스 시작하기 <ChevronRight size={24} />
                </Link>
                <Link to="/dashboard-preview" className="px-10 py-5 bg-white text-slate-900 rounded-full font-black text-xl shadow-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border border-slate-100">
                  보고서 보기
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ ...springConfig, delay: 0.3 }}
            className="relative hidden lg:block lg:col-span-6 2xl:col-span-5"
          >
            {/* Optimized Background Decoratives */}
            <div className="w-[140%] aspect-square bg-blue-600/5 rounded-full absolute -top-1/4 -right-1/4 animate-pulse blur-[100px]"></div>
            <div className="w-[100%] aspect-square bg-emerald-600/5 rounded-full absolute -bottom-1/4 -left-1/4 animate-pulse blur-[80px] delay-1000"></div>
            
            <div className="relative z-20 flex flex-col gap-10">
               {/* Header Info */}
               <div className="flex justify-start items-center">
                 <div className="text-base font-black text-blue-100 bg-blue-600 px-8 py-3.5 rounded-2xl flex items-center gap-4 shadow-xl shadow-blue-600/30">
                   <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                   <span>누적 혜택 합계 ({previewData.pointBalance.toLocaleString("ko-KR")}P)</span>
                 </div>
               </div>

               {/* Integrated Preview Grid */}
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
                 {/* Slot 1: Detail Card */}
                 <div className="backdrop-blur-2xl bg-white/40 p-10 rounded-[50px] border border-white/40 shadow-xl relative overflow-hidden group h-full transition-all duration-500">
                   <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                   <div className="relative z-10 flex flex-col h-full justify-between">
                     <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-12 shadow-xl shadow-blue-600/20">
                       <Wallet size={32} />
                     </div>
                     <div>
                        <div className="text-xl text-slate-400 font-bold mb-3 italic">Next Renewal</div>
                        <div className="text-5xl xl:text-6xl text-slate-900 font-black tracking-tighter mb-6 leading-none">854,200원</div>
                        <div className="text-base text-blue-600 font-black bg-white/80 px-6 py-3 rounded-xl inline-block border border-blue-100 shadow-sm">
                          15.4% DISCOUNT ↓
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Slot 2: Video Preview */}
                 <div className="rounded-[50px] border border-white/40 shadow-2xl relative overflow-hidden group h-[400px] xl:h-full bg-slate-900">
                    <video 
                      src="/media/background.mp4" 
                      autoPlay 
                      muted 
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
                    <div className="relative z-20 p-10 flex items-end h-full">
                      <div className="text-white w-full">
                        <motion.div 
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                          className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4"
                        >
                          Habit Intelligence
                        </motion.div>
                        <div className="text-4xl font-black leading-tight tracking-tight">당신의 습관을<br />가치로 바꿉니다</div>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Safety Score Badge */}
               <motion.div 
                 animate={{ 
                   y: [0, -15, 0],
                   rotate: [-2, 0, -2]
                 }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="self-start bg-blue-600 text-white p-10 rounded-[60px] shadow-2xl border-[12px] border-white/30 backdrop-blur-xl"
               >
                 <div className="text-xs font-black opacity-80 mb-4 tracking-widest uppercase text-blue-100">AI SAFETY SCORE</div>
                 <div className="flex items-baseline gap-3 mb-4">
                   <div className="text-7xl font-black italic tracking-tighter leading-none">88.5</div>
                   <div className="text-xl font-bold opacity-60">PTS</div>
                 </div>
                 <div className="flex items-center gap-4 bg-white/20 px-6 py-2.5 rounded-full border border-white/10">
                   <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                   <div className="text-lg font-bold text-white">Top 5% Eco Leader</div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Menu Grid */}
      <section className="bg-[#f4f7f6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
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
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link to={item.path} className="flex flex-col items-center gap-4 group">
                  <div className={`w-20 h-20 md:w-24 md:h-24 ${item.color} rounded-full flex items-center justify-center shadow-md group-hover:shadow-xl transition-all border border-white`}>
                    <item.icon size={36} />
                  </div>
                  <span className="text-lg font-black text-slate-800">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section - Professional Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 text-slate-900">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              className="text-4xl md:text-5xl font-black mb-4 break-keep tracking-tighter"
            >
              차원이 다른 전문 주행 분석 솔루션
            </motion.h2>
            <p className="text-slate-500 text-xl font-bold">오직 에코드라이브에서만 가능한 특별한 경험</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BarChart3, title: '정밀 주행 리포트', desc: '초단위 데이터를 기반으로 한 가장 정확한 주행 분석.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: TrendingUp, title: '보험료 혜택 동기화', desc: '주행 점수가 오르는 즉시 실시간 보험료 할인 반영.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: ShieldCheck, title: '실시간 가디언 케어', desc: '급가속, 급감속 발생 시 즉각적인 맞춤 조언 제공.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: ShoppingBag, title: 'Eco 포인트 보상', desc: '친환경 운전 성과에 따른 현금성 리워드 무제한 적립.', color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ ...springConfig, delay: i * 0.1 }}
                className="bg-white p-10 rounded-[30px] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-600"
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-10 transform group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 break-keep">{item.title}</h3>
                  <p className="text-slate-500 font-bold leading-relaxed break-keep">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Flow Section - Layered Blocks */}
      <section className="py-32 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-12 leading-tight break-keep tracking-tighter"
              >
                누구나 손쉽게 체험하는 <br />
                <span className="text-blue-600">스마트 에코 라이프</span>
              </motion.h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: '간편 데이터 연결', desc: '공인인증서 없이도 간편하게 내 차량과 보험 정보를 연결하세요.' },
                  { step: '02', title: '맞춤형 주행 분석', desc: '주행만 하면 AI가 당신의 에코 등급과 안전 점수를 자동 산출합니다.' },
                  { step: '03', title: '리워드 혜택 체감', desc: '분석 결과에 따른 즉각적인 보험료 할인과 포인트 적립을 확인하세요.' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-14 h-14 flex-shrink-0 bg-white shadow-sm text-blue-600 text-xl font-black rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all cursor-default">
                      {item.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-xl font-black text-slate-800 mb-2 break-keep">{item.title}</h4>
                      <p className="text-slate-500 font-bold break-keep">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full lg:h-[600px] h-[400px] bg-white rounded-[60px] p-10 flex items-center justify-center relative overflow-hidden shadow-2xl border border-slate-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl"></div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false }}
                className="bg-[#f8fafc] p-10 rounded-[50px] border border-slate-200 w-full max-w-sm relative z-10 shadow-inner"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Estimated Savings</div>
                    <div className="text-2xl font-black text-slate-900">854,200<span className="text-lg">원</span></div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between text-sm font-black">
                    <span className="text-slate-500">안전운전 지수</span>
                    <span className="text-blue-600 text-xl font-black">Grade A</span>
                  </div>
                  <div className="h-5 bg-white rounded-full overflow-hidden p-1 shadow-inner border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "88%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-blue-600 rounded-full shadow-sm"
                    ></motion.div>
                  </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-slate-200 flex justify-between items-center">
                  <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Discount Rate</div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ type: "spring", delay: 1 }}
                    className="text-4xl font-black text-blue-600 italic"
                  >
                    15.4%
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section - Live Experience */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">직관적인 주행 데이터 경험</h2>
            <p className="text-xl text-slate-500 font-bold">복잡한 데이터도 한눈에 이해하기 쉽게 시각화해 드립니다.</p>
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            className="rounded-[60px] border border-slate-100 bg-[#f8fafc] p-8 md:p-16 shadow-2xl"
          >
            <DashboardOverview
              stats={previewData.stats}
              pointBalance={previewData.pointBalance}
            />

            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <SavingsChartCard chartData={previewData.savingsChart} />
              </div>
              <DashboardSidePanel
                pointBalance={previewData.pointBalance}
                todayEarnedPoints={previewData.todayEarnedPoints}
                summaryNote={previewData.summaryNote}
                todayDrivingSummary={previewData.todayDrivingSummary}
              />
            </div>

            <div className="mt-12">
              <InsuranceDiscountPreview items={previewData.insurancePreviews} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA Section - High Impact Banner */}
      <section className="py-40 bg-blue-600 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white rounded-full blur-[200px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tighter break-keep"
          >
            지금 바로 에코 드라이버로 <br />
            전환하고 혜택을 받으세요!
          </motion.h2>
          <p className="text-white/70 mb-16 text-2xl font-bold max-w-3xl mx-auto">
            가입 없이 체험부터 시작해 보세요. 당신의 운전이 보상이 됩니다.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link 
                to="/login"
                className="w-full px-16 py-7 bg-white text-blue-600 rounded-full font-black text-2xl shadow-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-black">K</div>
                카카오 1초 로그인
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Professional cleanup */}
      <footer className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 font-black text-3xl mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <ShieldCheck size={26} />
                </div>
                ECODRIVE
              </div>
              <p className="text-slate-400 font-bold leading-relaxed max-w-md">
                (주)에코드라이브는 당신의 안전한 이동을 가치로 바꾸는 <br />
                미래 지향적 모빌리티 테크 리더입니다.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
              <div>
                <div className="font-black text-lg mb-6">서비스</div>
                <ul className="space-y-4 text-slate-400 font-bold text-sm">
                  <li><Link to="/report" className="hover:text-blue-600 transition-colors">주행분석</Link></li>
                  <li><Link to="/insurance" className="hover:text-blue-600 transition-colors">보험할인</Link></li>
                  <li><Link to="/payment" className="hover:text-blue-600 transition-colors">에코페이</Link></li>
                </ul>
              </div>
              <div>
                <div className="font-black text-lg mb-6">고객지원</div>
                <ul className="space-y-4 text-slate-400 font-bold text-sm">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">자주 묻는 질문</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">공지사항</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">1:1 문의</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 font-bold text-sm">
              © 2026 ECODRIVE Corp. All rights reserved.
            </div>
            <div className="flex gap-8 font-black text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">전자금융거래약관</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
