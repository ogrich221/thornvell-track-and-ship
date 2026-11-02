// 30 countries shown on the homepage globe (no African countries; includes Australia).
// Edit this list to match the real coverage. [name, lon, lat]
export const COVERAGE: [string, number, number][] = [
  ["United States", -98, 39], ["Canada", -106, 56], ["Mexico", -102, 23], ["Brazil", -51, -10],
  ["Argentina", -64, -34], ["Chile", -71, -33], ["Colombia", -74, 4], ["Peru", -76, -10],
  ["United Kingdom", -2, 54], ["Ireland", -8, 53], ["France", 2, 46], ["Germany", 10, 51],
  ["Netherlands", 5, 52], ["Belgium", 4, 50.5], ["Spain", -4, 40], ["Portugal", -8, 39.5],
  ["Italy", 12.5, 42.5], ["Switzerland", 8, 47], ["Sweden", 16, 62], ["Norway", 9, 61],
  ["Poland", 19, 52], ["Turkey", 35, 39], ["United Arab Emirates", 54, 24], ["Saudi Arabia", 45, 24],
  ["India", 78, 22], ["China", 104, 35], ["Japan", 138, 37], ["South Korea", 128, 36],
  ["Singapore", 103.8, 1.35], ["Australia", 134, -25],
];

// 30 languages for the selector (no African countries). code = Google Translate code.
export const LANGUAGES: { code: string; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" }, { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" }, { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" }, { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" }, { code: "sv", label: "Svenska", flag: "🇸🇪" },
  { code: "no", label: "Norsk", flag: "🇳🇴" }, { code: "da", label: "Dansk", flag: "🇩🇰" },
  { code: "fi", label: "Suomi", flag: "🇫🇮" }, { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "cs", label: "Čeština", flag: "🇨🇿" }, { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
  { code: "hu", label: "Magyar", flag: "🇭🇺" }, { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "uk", label: "Українська", flag: "🇺🇦" }, { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" }, { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "iw", label: "עברית", flag: "🇮🇱" }, { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" }, { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" }, { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }, { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" }, { code: "tl", label: "Filipino", flag: "🇵🇭" },
];
