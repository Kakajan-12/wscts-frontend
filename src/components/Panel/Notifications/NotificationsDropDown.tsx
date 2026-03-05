'use client';

import { useEffect, useRef, useState } from 'react';
import {
    IoIosClose,
    IoIosNotificationsOutline,
    IoIosArrowBack
} from 'react-icons/io';
import {useTranslations} from "next-intl";

type Notification = {
    id: number;
    name: string;
    time: string;
    unread?: boolean;
    file?: string;
    text?: string;
};

export default function NotificationsDropdown() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Notification | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const t = useTranslations('Notifications');

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSelected(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(true)}>
                <IoIosNotificationsOutline size={36} className="text-[#065F46]" />
            </button>

            {open && (
                <div className="fixed right-0 top-0 h-screen w-[380px] bg-white border-l shadow-2xl z-50 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-4 border-b">
                        {selected ? (
                            <button
                                onClick={() => setSelected(null)}
                                className="flex items-center gap-2 text-sm"
                            >
                                <IoIosArrowBack size={22} />
                                {t('back')}
                            </button>
                        ) : (
                            <div className="font-semibold text-lg">{t('notification')}</div>
                        )}

                        <button onClick={() => setOpen(false)}>
                            <IoIosClose size={28} />
                        </button>
                    </div>

                    {!selected ? (
                        <>
                            <div className="flex gap-4 px-4 py-3 text-sm border-b">
                <span className="font-semibold border-b-2 border-green-700 pb-1 cursor-pointer">
                  {t('all')}{' '}
                </span>
                                <span className="text-gray-500 cursor-pointer">
                  {t('unread')}
                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {t('no-data')}
                            </div>
                        </>
                    ) : (
                        <NotificationDetails notification={selected} />
                    )}
                </div>
            )}
        </div>
    );
}

function NotificationDetails({
                                 notification
                             }: {
    notification: Notification;
}) {
    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300" />
                <div>
                    <div className="font-semibold">{notification.name}</div>
                    <div className="text-xs text-gray-400">
                        {notification.time}
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-700">
                {notification.text}
            </div>

            {notification.file && (
                <div className="border rounded-md p-3 flex items-center gap-2">
                    📎 <span>{notification.file}</span>
                    <button className="ml-auto text-green-700 text-sm">
                        Скачать
                    </button>
                </div>
            )}
        </div>
    );
}
