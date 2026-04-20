import { 
  ShieldCheck, 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  ChevronRight,
  CheckCircle2,
  Car,
  Wallet,
  Zap
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
    <div className="bg-[#F8FAFC] -m-4 md:-m-8 min-h-screen overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 lg:min-h-[85vh] flex items-center overflow-hidden bg-white">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-b-[80px]">
          <video 
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover scale-105"
            src="/media/background.mp4"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.1 }}
              className="relative -top-[245px] text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight break-keep drop-shadow-sm"
            >
              주행 기록이 혜택이 되는 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">놀라운 마법</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Hero Section Below - Call to Action */}
      <div className="py-12 flex justify-center bg-transparent relative z-20">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
        >
          <Link to="/dashboard-preview" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white shadow-xl shadow-slate-200/50 text-slate-600 font-bold hover:text-blue-600 transition-colors border border-slate-100 cursor-pointer text-lg">
            대시보드 살짝 구경가기 <ChevronRight size={20} />
          </Link>
        </motion.div>
      </div>

      {/* Core Values Section - Playful Cards */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-blue-600/5 skew-y-3 origin-bottom-left -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 text-slate-900">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              className="text-4xl md:text-5xl font-black mb-4 break-keep"
            >
              매일의 운전이 즐거워지는 혜택
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: '안전운전 리포트', desc: '주행 습관을 한눈에! 점수가 쑥쑥 오르는 재미.', color: 'text-blue-600', bg: 'bg-blue-100' },
              { icon: TrendingUp, title: '보험료 다이어트', desc: '점수에 따라 자동으로 줄어드는 보험료의 마법.', color: 'text-indigo-600', bg: 'bg-indigo-100' },
              { icon: ShieldCheck, title: '찰떡 보험 찾기', desc: '내 운전 스타일에 딱 맞는 최적의 할인을 비교해드려요.', color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { icon: ShoppingBag, title: '통통 튀는 포인트', desc: '탄소 절감 보너스로 맛있는 커피 한 잔의 여유를!', color: 'text-orange-600', bg: 'bg-orange-100' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ ...springConfig, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 relative overflow-hidden group cursor-pointer"
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${item.bg} opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-[24px] flex items-center justify-center mb-8 rotate-3 group-hover:-rotate-3 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 break-keep">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed break-keep">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Flow Section - Engaging Steps */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-12 leading-tight break-keep"
              >
                시작부터 혜택까지 <br />
                <span className="text-blue-600">참 쉽죠?</span>
              </motion.h2>
              <div className="space-y-10">
                {[
                  { step: '01', title: '초간단 연결', desc: '소셜 로그인 한 번이면 차량과 보험 정보가 스르륵 연결됩니다.' },
                  { step: '02', title: '알아서 척척 분석', desc: '주행만 하세요! 나머지는 저희가 다 알아서 분석해드릴게요.' },
                  { step: '03', title: '기분 좋은 리워드', desc: '할인된 보험료와 팡팡 터지는 포인트 혜택을 맘껏 누리세요.' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-6 group cursor-pointer"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-blue-50 text-blue-600 text-2xl font-black rounded-[24px] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-xl font-bold text-slate-900 mb-2 break-keep">{item.title}</h4>
                      <p className="text-slate-500 font-medium break-keep">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full lg:h-[600px] h-[400px] bg-slate-100 rounded-[60px] p-8 flex items-center justify-center relative overflow-hidden">
              {/* Dynamic Blob Background */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-0 m-auto w-[150%] h-[150%] bg-gradient-to-tr from-blue-300/30 to-indigo-400/30 rounded-[40%] blur-xl"
              ></motion.div>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-slate-50 w-full max-w-sm relative z-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[20px] flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">다음 달 예상 보험료</div>
                    <div className="text-2xl font-black text-slate-900">854,200<span className="text-lg">원</span></div>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">안전운전 파워 점수</span>
                    <span className="text-blue-600 text-lg">88점</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "88%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                    ></motion.div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                  <div className="text-sm font-bold text-slate-500">예상 할인율</div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ type: "spring", delay: 1 }}
                    className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    15.4%
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-white relative overflow-hidden rounded-t-[80px] mt-[-80px] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">대시보드를 살짝 엿볼까요?</h2>
            <p className="text-lg text-slate-500 font-medium">실제 로그인 후 만나보게 될 귀여운 화면들이에요.</p>
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            className="rounded-[50px] border-8 border-slate-50 bg-white p-6 shadow-2xl md:p-10"
          >
            <DashboardOverview
              stats={previewData.stats}
              pointBalance={previewData.pointBalance}
            />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <SavingsChartCard chartData={previewData.savingsChart} />
              <DashboardSidePanel
                pointBalance={previewData.pointBalance}
                todayEarnedPoints={previewData.todayEarnedPoints}
                summaryNote={previewData.summaryNote}
                todayDrivingSummary={previewData.todayDrivingSummary}
              />
            </div>

            <div className="mt-8">
              <InsuranceDiscountPreview items={previewData.insurancePreviews} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-32 bg-blue-600 text-white text-center relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500 rounded-full blur-[100px] opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[100px] opacity-40 -z-10 -translate-x-1/2 translate-y-1/2"
        ></motion.div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.h2 
             initial={{ y: 20, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             viewport={{ once: true }}
             className="text-5xl md:text-6xl font-black mb-8 leading-tight break-keep"
          >
            지금 운전석에 앉아 <br />
            기분 좋은 할인을 시작해보세요!
          </motion.h2>
          <p className="text-blue-100 mb-12 text-xl font-medium">간단한 로그인만으로 내 차량과 바로 연결됩니다.</p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link 
                to="/login"
                className="w-full px-12 py-6 bg-[#FEE500] text-[#191600] rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-[#f7dc00] transition-colors shadow-2xl shadow-blue-900/40"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#191600] text-sm font-black text-[#FEE500]">
                  K
                </span>
                카카오로 1초만에 시작
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 font-black text-xl text-slate-900">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[14px] flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={22} />
            </div>
            ECODRIVE
          </div>
          <div className="text-slate-400 font-medium">
            © 2026 ECODRIVE. All rights reserved.
          </div>
          <div className="flex gap-6 font-bold text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">이용약관</a>
            <a href="#" className="hover:text-blue-600 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-blue-600 transition-colors">고객센터</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
