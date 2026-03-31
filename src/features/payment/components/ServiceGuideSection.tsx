import { ShieldCheck, ShoppingBag, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function ServiceGuideSection() {
  const services = [
    { 
      icon: ShieldCheck, 
      label: '보험료 결제', 
      desc: '안전운전 점수 기반 할인 혜택', 
      color: 'bg-blue-50 text-blue-600',
      tag: '할인 혜택'
    },
    { 
      icon: ShoppingBag, 
      label: '리워드 스토어', 
      desc: '포인트로 구매하는 다양한 상품', 
      color: 'bg-emerald-50 text-emerald-600',
      tag: '포인트 사용'
    },
    { 
      icon: Zap, 
      label: '생활형 혜택', 
      desc: '주유, 세차, 주차 등 차량 관리', 
      color: 'bg-orange-50 text-orange-600',
      tag: '차량 관리'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {services.map((service, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <service.icon size={24} />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${service.color} bg-opacity-10`}>
              {service.tag}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 mb-1">{service.label}</h4>
          <p className="text-xs text-slate-500 mb-4">{service.desc}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 group-hover:underline">
            자세히 보기 <ChevronRight size={12} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
