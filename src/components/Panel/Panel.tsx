"use client";

import { useState, useEffect } from "react";
// import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { IoSettingsOutline } from "react-icons/io5";
import NotificationsDropdown from "@/components/Panel/Notifications/NotificationsDropDown";
import SettingsModal from "@/components/Panel/Settings/Settings";

function useCloseOnRouteChange(isOpen: boolean, onClose: () => void) {
    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [pathname]);
}

export default function Panel() {
    const [dateTime, setDateTime] = useState(new Date());
    const [settingsOpen, setSettingsOpen] = useState(false);
    // const t = useTranslations("Panel");

    useCloseOnRouteChange(settingsOpen, () => setSettingsOpen(false));

    useEffect(() => {
        const interval = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formattedTime = dateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const formattedDate = dateTime.toLocaleDateString();

    return (
        <>
            <div className="sticky top-0 bg-white border-b main-border z-[1100]">
                <div className="px-4 py-2 flex items-center justify-end">
                    {/*<form className="w-full" onSubmit={(e) => e.preventDefault()}>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        placeholder={t("search")}*/}
                    {/*        className="main-border border rounded-md px-4 py-2 w-full"*/}
                    {/*        aria-label={t("search")}*/}
                    {/*    />*/}
                    {/*</form>*/}

                    <div className="flex items-stretch divide-x-2 divide-[#065F468C] h-12 ml-4">
                        <div className="flex flex-col items-center justify-center px-2">
                            <div className="text-[#065F46] font-medium" role="timer">
                                {formattedTime}
                            </div>
                            <div className="text-[#065F46] font-medium">
                                {formattedDate}
                            </div>
                        </div>

                        <div className="px-2 flex items-center">
                            <LanguageSwitcher />
                        </div>

                        <div className="px-2 flex items-center">
                            <NotificationsDropdown />
                        </div>

                        <button
                            onClick={() => setSettingsOpen(true)}
                            className="px-2 flex items-center hover:bg-gray-50 rounded transition-colors"
                        >
                            <IoSettingsOutline
                                size={36}
                                className="text-[#065F46]"
                            />
                        </button>
                    </div>
                </div>
            </div>

            <SettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
}