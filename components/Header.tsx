"use client";

import React, { useState } from "react";
import { Settings, X, ChevronDown, Check, Globe } from "lucide-react";
import { LANGUAGES } from "../lib/constants";
import { useLingoContext, type LocaleCode } from "@lingo.dev/compiler/react";
import { cn } from "../lib/utils";

export default function Header() {
    const { locale, setLocale } = useLingoContext();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <header className="w-full border-b border-stone-200 bg-white/50 backdrop-blur-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        S
                    </div>
                    <span className="text-xl font-bold tracking-tight text-primary-foreground hidden sm:block">
                        SpawnInvoice
                    </span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-600 focus:outline-none"
                        aria-label="Settings"
                    >
                        <Settings size={22} className={cn("transition-transform duration-300", isSettingsOpen && "rotate-90")} />
                    </button>

                    {isSettingsOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsSettingsOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                                    <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                                        <Globe size={16} /> App Settings
                                    </h3>
                                    <button onClick={() => setIsSettingsOpen(false)} className="text-stone-400 hover:text-stone-600">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="p-2">
                                    <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
                                        Interface Language
                                    </div>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        {LANGUAGES.map((lang: { code: string; name: string }) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLocale(lang.code as LocaleCode);
                                                    setIsSettingsOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                                                    locale === lang.code
                                                        ? "bg-primary-foreground text-white font-medium"
                                                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                                )}
                                            >
                                                {lang.name}
                                                {locale === lang.code && <Check size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 bg-stone-50 text-[10px] text-stone-400 text-center border-t border-stone-100">
                                    Localizations powered by Lingo.dev
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
