export const PLAN_RANK = { 
  BASIC: 0, 
  STANDARD: 1, 
  PREMIUM: 2 
} as const;

export const PLAN_MULTIPLIERS = { 
  BASIC: 0.8, 
  STANDARD: 1.0, 
  PREMIUM: 1.3 
} as const;

export const PLAN_LABELS = {
  BASIC: { title: "실속", icon: "➕", desc: "운전자 3대 필수 비용은 기본" },
  STANDARD: { title: "표준", icon: "🏆", desc: "자동차 사고로 다쳤을 때 걱정없게" },
  PREMIUM: { title: "고급", icon: "🛡️", desc: "사고 후 치료와 재활까지 꼼꼼하게", badge: "60개 보장" }
} as const;

export const PLAN_INFO = {
  BASIC:    { label: '기본형',    desc: '대인·대물 기본 보장',         multiplier: 0.8, color: 'border-slate-300 bg-slate-50'  },
  STANDARD: { label: '표준형',    desc: '기본 + 자기신체·무보험차',     multiplier: 1.0, color: 'border-blue-400 bg-blue-50'   },
  PREMIUM:  { label: '프리미엄형', desc: '전항목 + 무제한 대인·긴급출동', multiplier: 1.3, color: 'border-indigo-400 bg-indigo-50' },
} as const;

export type PlanType = keyof typeof PLAN_RANK;
