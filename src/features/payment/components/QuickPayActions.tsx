import { Plus, Send, Coins, History } from 'lucide-react';
import { motion } from 'motion/react';

export function QuickPayActions() {
  const actions = [
    { icon: Plus, label: '충전하기', color: 'bg-blue-50 text-blue-600' },
    { icon: Send, label: '결제하기', color: 'bg-slate-900 text-white' },
    { icon: Coins, label: '포인트 사용', color: 'bg-amber-50 text-amber-600' },
    { icon: History, label: '이용내역', color: 'bg-slate-50 text-slate-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, i) => (
        <motion.button
          key={i}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
        >
          <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <action.icon size={24} />
          </div>
          <span className="text-sm font-bold text-slate-800">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
