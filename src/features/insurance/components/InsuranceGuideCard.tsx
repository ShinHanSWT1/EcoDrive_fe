import { Download, FileText } from "lucide-react";
import type { InsuranceGuide } from "../insurance.types";

type InsuranceGuideCardProps = {
  guide: InsuranceGuide;
};

export default function InsuranceGuideCard({ guide }: InsuranceGuideCardProps) {
  return (
    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center gap-6">
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <FileText size={32} className="text-blue-600" />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h4 className="font-bold text-blue-900 mb-1">{guide.title}</h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          {guide.description}
        </p>
      </div>

      <button className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm">
        <Download size={16} /> 가이드 다운로드
      </button>
    </div>
  );
}
