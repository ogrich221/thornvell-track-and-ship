import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/coverage";

declare global {
  interface Window { googleTranslateElementInit?: () => void; google?: any }
}

function readLang() {
  const m = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "en";
}

export function LanguageSelect() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(readLang());
    if (document.getElementById("gt-script")) return;
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, "gt-el");
    };
    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, []);

  const change = (code: string) => {
    const host = location.hostname;
    const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (code === "en") {
      document.cookie = `googtrans=; path=/; ${expire}`;
      document.cookie = `googtrans=; path=/; domain=${host}; ${expire}`;
      document.cookie = `googtrans=; path=/; domain=.${host}; ${expire}`;
    } else {
      document.cookie = `googtrans=/en/${code}; path=/`;
      document.cookie = `googtrans=/en/${code}; path=/; domain=${host}`;
    }
    location.reload();
  };

  return (
    <label className="notranslate flex items-center gap-1.5 rounded-full border border-navy-foreground/20 bg-navy-deep/40 px-2.5 py-1.5 text-xs text-navy-foreground/90 backdrop-blur">
      <Globe className="h-3.5 w-3.5 text-gold" aria-hidden />
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={(e) => change(e.target.value)}
        className="max-w-[7.5rem] cursor-pointer bg-transparent outline-none [&>option]:bg-navy-deep [&>option]:text-navy-foreground"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
        ))}
      </select>
      <div id="gt-el" className="hidden" />
    </label>
  );
}
