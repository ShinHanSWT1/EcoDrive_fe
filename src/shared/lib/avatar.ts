function encodeSvg(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getDefaultAvatarDataUrl(label = "U") {
  const safeLabel = (label.trim().charAt(0) || "U").toUpperCase();

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" rx="48" fill="#E2E8F0" />
      <circle cx="100" cy="78" r="34" fill="#CBD5E1" />
      <path d="M46 166c8-26 29-40 54-40s46 14 54 40" fill="#CBD5E1" />
      <text x="100" y="186" text-anchor="middle" fill="#475569" font-family="Arial, sans-serif" font-size="24" font-weight="700">
        ${safeLabel}
      </text>
    </svg>
  `);
}
