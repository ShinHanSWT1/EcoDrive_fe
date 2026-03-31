import type { MissionGuide } from "../mission.types";

type MissionGuideCardProps = {
  guide: MissionGuide;
};

export default function MissionGuideCard({ guide }: MissionGuideCardProps) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
      <h5 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-widest">
        미션 참여 안내
      </h5>

      <ul className="space-y-3">
        {guide.items.map((text, index) => (
          <li
            key={index}
            className="flex gap-2 text-[11px] text-slate-500 leading-relaxed"
          >
            <div className="w-1 h-1 bg-slate-300 rounded-full mt-1.5 shrink-0" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
