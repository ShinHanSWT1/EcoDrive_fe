export const reportPdfTheme = {
 fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif",
 primaryColor: "#2563eb", // 주행 데이터 포인트 컬러
 successColor: "#10b981", // 탄소 절감/포인트 컬러 (ESG)
 textColor: "#143D60", // 진한 회색 (본문)
 mutedTextColor: "#64748b", // 연한 회색 (설명)
 borderColor: "#f1f5f9",
 headerBgColor: "#f8fafc",
 cardBgColor: "#ffffff",
 pagePadding: "40px", // 여백을 더 넓게 설정
 titleSize: "28px",
 sectionTitleSize: "18px",
 bodyFontSize: "12px",
 tableFontSize: "12px",
 numberPrecision: 2,
 estimatedEmissionFactorKgPerKm: 0.192,
} as const;
