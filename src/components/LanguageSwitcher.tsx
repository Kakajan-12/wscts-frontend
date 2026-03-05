'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const locales = routing.locales;

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const changeLanguage = (newLocale: string) => {
        setOpen(false);
        router.replace(pathname, { locale: newLocale });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-center">
            <button
                onClick={() => setOpen(!open)}
                className="px-2 py-1 text-xl font-medium text-[#065F46] rounded-md cursor-pointer"
            >
                {locale.toUpperCase()}
            </button>

            {open && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-14 rounded-md shadow-lg bg-white z-10">
                    {locales.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => changeLanguage(lang)}
                            disabled={locale === lang}
                            className={`block w-full text-center px-4 py-2 text-md cursor-pointer ${
                                locale === lang ? 'bg-[#065F46] text-white cursor-default' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
