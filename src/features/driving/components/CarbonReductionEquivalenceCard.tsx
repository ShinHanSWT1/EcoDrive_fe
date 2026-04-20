import { Leaf, Navigation, Zap, Fuel, Sparkles } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { motion } from "motion/react";

interface CarbonReductionEquivalenceCardProps {
 carbonReductionKg: number | null;
}

type EquivalenceItem = {
 title: string;
 value: string;
 label: string;
 icon: typeof Leaf;
 color: string;
 bg: string;
 borderColor: string;
};

function formatCarbonSaved(carbonReductionKg: number) {
 return `${carbonReductionKg.toFixed(2)}kg CO₂`;
}

export function CarbonReductionEquivalenceCard({
 carbonReductionKg,
}: CarbonReductionEquivalenceCardProps) {
 const normalizedCarbonReductionKg = carbonReductionKg ?? 0;
 const treeMonths = Math.max(normalizedCarbonReductionKg / 0.7, 0);
 const drivingKm = Math.max(normalizedCarbonReductionKg / 0.16, 0);
 const gasolineLiters = Math.max(normalizedCarbonReductionKg / 2.31, 0);
 const electricityKwh = Math.max(normalizedCarbonReductionKg / 0.424, 0);

 const items: EquivalenceItem[] = [
   {
     title: "울창한 나무 파워",
     value: `${treeMonths.toFixed(1)}개월`,
     label: "산신령 나무 1그루가 흡수하는 어마어마한 양!",
     icon: Leaf,
     color: "text-emerald-500",
     bg: "bg-emerald-50",
   },
   {
     title: "슈퍼 드라이빙 파워",
     value: `${drivingKm.toFixed(1)}km`,
     label: "요술 자동차가 뿜어내는 가스와 맞먹어요!",
     icon: Navigation,
     color: "text-blue-500",
     bg: "bg-blue-50",
   },
   {
     title: "에너지 기름 파워",
     value: `${gasolineLiters.toFixed(2)}L`,
     label: "찰랑찰랑 아낀 소중한 휘발유!",
     icon: Fuel,
     color: "text-amber-500",
     bg: "bg-amber-50",
   },
   {
     title: "번개번개 전기 파워",
     value: `${electricityKwh.toFixed(2)}kWh`,
     label: "피카피카 번개 파워로 환산 가능한 기적!",
     icon: Zap,
     color: "text-indigo-500",
     bg: "bg-indigo-50",
   },
 ];

 return (
   <div className="bg-white p-8 rounded-[40px] sm:p-10 relative overflow-hidden">
     <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

     <div className="mb-10 relative z-10">
       <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
         내가 모은 신비한 아우라 <span className="text-4xl text-[#1A5D40] mx-1">{formatCarbonSaved(normalizedCarbonReductionKg)}</span> 는?
       </h3>
       <p className="text-sm text-slate-900 font-bold mt-2 bg-slate-50 px-4 py-2 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
         우리 주변의 어마어마한 마법으로 변환해봤어요! <Sparkles className="text-[#A0C878]" fill="#A0C878" size={16} />
       </p>
     </div>

     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 relative z-10">
       {items.map((item, index) => (
         <motion.div
           whileHover={{ y: -6, scale: 1.02 }}
           transition={{ type: "spring", stiffness: 300 }}
           key={item.title}
           className={`rounded-[32px] bg-white p-6 shadow-sm`}
         >
           <div className="flex items-start gap-4">
             <div
               className={cn(
                 "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 ",
                 item.bg,
                 item.color,
               )}
             >
               <item.icon size={28} />
             </div>
             <div className="min-w-0 pt-1">
               <div className={`text-xs font-black uppercase tracking-widest ${item.color}`}>
                 {item.title}
               </div>
               <div className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                 {item.value}
               </div>
 <p className="mt-2 text-[13px] font-bold leading-relaxed text-slate-900 bg-slate-50 p-2 rounded-xl">
 {item.label}
 </p>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );
}
