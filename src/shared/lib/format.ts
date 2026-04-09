export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0원";
  }
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatMileageKm(value: number): string {
  if (value >= 10000) {
    const manKm = value / 10000;
    return `${manKm.toFixed(1)}만km`;
  }

  return `${value.toLocaleString("ko-KR")}km`;
}
