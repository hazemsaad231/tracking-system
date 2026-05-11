import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "اختر...",
  isLoading,
  disabled,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);
  const isDisabled = disabled || isLoading;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => !isDisabled && setOpen((p) => !p)}
        disabled={isDisabled}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-right
          bg-white border border-slate-200
          dark:bg-slate-800 dark:border-slate-700
          hover:border-purple-400 dark:hover:border-purple-500
          focus:outline-none focus:border-purple-400 dark:focus:border-purple-500
          transition-colors disabled:opacity-60 disabled:cursor-not-allowed
          ${open ? "border-purple-400 dark:border-purple-500 ring-2 ring-purple-500/20 dark:ring-purple-400/20" : ""}
        `}
      >
        <span className={selected ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-400"}>
          {isLoading ? "جاري التحميل..." : selected?.label ?? placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 dark:text-slate-300 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`
          absolute z-50 w-full mt-1 rounded-xl overflow-hidden
          bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          shadow-xl shadow-black/10 dark:shadow-black/50
          transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}
        `}
      >
        <button
          type="button"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className="w-full text-right px-4 py-2.5 text-sm transition-colors text-slate-400 dark:text-slate-400 italic hover:bg-slate-50 dark:hover:bg-slate-700/60"
        >
          {placeholder}
        </button>

        <div className="h-px bg-slate-100 dark:bg-slate-700" />

        <div className="max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`
                w-full text-right px-4 py-2.5 text-sm flex items-center justify-between gap-2
                transition-colors duration-150
                ${value === opt.value
                  ? "bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                }
              `}
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <svg className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
