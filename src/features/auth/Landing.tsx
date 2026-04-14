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

  return (
    <div className="bg-white -m-4 md:-m-8 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6"
            >
              <ShieldCheck size={14} />
              주행 데이터 기반 보험료 절감 서비스
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6"
            >
              주행 데이터로 보험료를 <br />
              <span className="text-blue-600">줄이는 가장 쉬운 방법</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 mb-10 leading-relaxed"
            >
              안전운전 점수를 기반으로 보험료를 할인받고 <br className="hidden md:block" />
              친환경 운전으로 탄소 절감 포인트 혜택을 누리세요.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-[#FEE500] text-[#191600] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#f7dc00] transition-all shadow-lg shadow-yellow-100"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#191600] text-xs font-black text-[#FEE500]">
                  K
                </span>
                카카오로 시작하기
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                구글로 시작하기
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Link to="/dashboard-preview" className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors">
                서비스 미리보기 <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">운전만 해도 혜택이 쌓이는 금융 경험</h2>
            <p className="text-slate-500">Driving Insight가 제공하는 4가지 핵심 가치</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BarChart3, title: '안전운전 점수 분석', desc: '급가속, 급감속 등 주행 습관을 정밀 분석하여 점수로 환산합니다.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: TrendingUp, title: '보험료 절감 예측', desc: '현재 점수로 다음 달 보험료가 얼마나 줄어들지 실시간으로 예측합니다.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: ShieldCheck, title: '보험사별 할인 비교', desc: '내 점수로 가장 큰 할인을 받을 수 있는 보험사를 한눈에 비교합니다.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: ShoppingBag, title: '포인트 & 쿠폰 혜택', desc: '주행 보너스로 모은 포인트로 주유, 세차 등 실생활 혜택을 누리세요.', color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
              >
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Flow Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                데이터 연동부터 할인까지 <br />
                단 3단계면 충분합니다
              </h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: '차량 및 보험 정보 등록', desc: '간단한 소셜 로그인 후 내 차량과 현재 가입된 보험 정보를 입력합니다.' },
                  { step: '02', title: '주행 데이터 자동 분석', desc: '커넥티드카 또는 주행 기록 파일을 통해 안전 점수와 탄소 절감 성과를 분석합니다.' },
                  { step: '03', title: '보험 할인 및 탄소 리워드 획득', desc: '안전 점수로 보험료 할인을 받고, 탄소 절감 성과에 따른 포인트를 적립합니다.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-2xl font-black text-blue-100">{item.step}</div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 bg-slate-100 rounded-[40px] p-8 aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm relative z-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Next Premium</div>
                    <div className="text-lg font-bold text-slate-900">854,200원</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[88%]"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">안전운전 점수</span>
                    <span className="text-blue-600">88점</span>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-xs font-bold text-slate-400">예상 할인율</div>
                  <div className="text-xl font-black text-blue-600">15.4%</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">데이터가 돈이 되는 대시보드</h2>
            <p className="text-slate-500">로그인 후 보게 될 메인 대시보드 화면을 그대로 미리 확인해보세요.</p>
          </div>

          <div className="rounded-[40px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <DashboardOverview
              stats={previewData.stats}
              pointBalance={previewData.pointBalance}
            />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <SavingsChartCard chartData={previewData.savingsChart} />
              <DashboardSidePanel
                pointBalance={previewData.pointBalance}
                todayEarnedPoints={previewData.todayEarnedPoints}
                summaryNote={previewData.summaryNote}
                todayDrivingSummary={previewData.todayDrivingSummary}
              />
            </div>

            <div className="mt-6">
              <InsuranceDiscountPreview items={previewData.insurancePreviews} />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 bg-blue-600 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-6">지금 시작하고 내 보험료를 확인해보세요</h2>
          <p className="text-blue-100 mb-10 text-lg">단 1분이면 내 차량과 보험 정보를 연결할 수 있습니다.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-10 py-5 bg-[#FEE500] text-[#191600] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#f7dc00] transition-all shadow-xl shadow-blue-900/20"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#191600] text-xs font-black text-[#FEE500]">
                K
              </span>
              카카오로 시작하기
            </Link>
            <Link 
              to="/login"
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-xl shadow-blue-900/20"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              구글로 시작하기
            </Link>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10"><Car size={100} /></div>
          <div className="absolute bottom-10 right-10"><Wallet size={120} /></div>
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2"><Zap size={80} /></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
              <ShieldCheck size={14} />
            </div>
            Driving Insight
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 Driving Insight. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600">이용약관</a>
            <a href="#" className="hover:text-blue-600">개인정보처리방침</a>
            <a href="#" className="hover:text-blue-600">고객센터</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
