'use client';
import { useRef, useEffect } from 'react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ru, enUS } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import { FaRegClock } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";

interface DatePickerFieldProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
}

interface Translations {
    months: Record<number, string>;
    weekdays: Record<number, string>;
    weekdaysShort: string[];
}

const tkTranslations: Translations = {
    months: {
        0: 'Ýanwar', 1: 'Fewral', 2: 'Mart', 3: 'Aprel',
        4: 'Maý', 5: 'Iýun', 6: 'Iýul', 7: 'Awgust',
        8: 'Sentýabr', 9: 'Oktýabr', 10: 'Noýabr', 11: 'Dekabr'
    },
    weekdays: {
        0: 'Ýe',
        1: 'Du',
        2: 'Si',
        3: 'Ça',
        4: 'Pe',
        5: 'An',
        6: 'Şe'
    },
    weekdaysShort: ['Ýe', 'Du', 'Si', 'Ça', 'Pe', 'An', 'Şe']
};

export function DatePickerField({ selected, onChange, placeholder }: DatePickerFieldProps) {
    const ref = useRef<HTMLDivElement>(null);
    const t = useTranslations('Filter');
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [internalDate, setInternalDate] = useState<Date | null>(null);

    const getPlaceholder = () => {
        if (locale === 'ru') return 'дд.мм.гггг чч:мм';
        if (locale === 'tk') return 'dd.mm.yyyy hh:mm';
        return 'mm/dd/yyyy hh:mm';
    };

    const actualPlaceholder = placeholder || getPlaceholder();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dateFnsLocale = locale === 'ru' ? ru :
        locale === 'tk' ? enUS :
            enUS;

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const newDate = new Date(date);
            if (internalDate) {
                newDate.setHours(internalDate.getHours());
                newDate.setMinutes(internalDate.getMinutes());
            } else {
                newDate.setHours(0, 0, 0, 0);
            }
            setInternalDate(newDate);
        }
    };

    const handleTimeChange = (hours: number, minutes: number) => {
        if (internalDate) {
            const newDate = new Date(internalDate);
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            setInternalDate(newDate);
            onChange(newDate);
            setIsOpen(false);
        }
    };

    const handleApply = () => {
        if (internalDate) {
            onChange(internalDate);
        }
        setIsOpen(false);
    };

    const formatDisplay = (date: Date | null) => {
        if (!date) return actualPlaceholder;

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (locale === 'ru' || locale === 'tk') {
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        } else {
            return `${month}/${day}/${year} ${hours}:${minutes}`;
        }
    };

    const getLocalizedMonthName = (date: Date) => {
        if (locale === 'tk' && tkTranslations.months) {
            const monthName = tkTranslations.months[date.getMonth()];
            return `${monthName} ${date.getFullYear()}`;
        }

        try {
            return date.toLocaleDateString(locale, {
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return date.toLocaleDateString('en', {
                month: 'long',
                year: 'numeric'
            });
        }
    };

    const renderWeekDays = () => {
        if (locale === 'tk') {
            return (
                <div className="flex justify-between text-gray-500 text-sm mb-1 px-1">
                    {tkTranslations.weekdaysShort.map((day, index) => (
                        <div key={index} className=" text-center py-1">
                            {day}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (const minute of [0, 15, 30, 45]) {
            timeSlots.push({
                hour,
                minute,
                label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            });
        }
    }

    return (
        <div className="relative" ref={ref}>
            <div
                className="border main-border rounded-md px-3 py-2 flex items-center justify-between cursor-pointer bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`${selected ? 'text-gray-800' : 'text-gray-500'}`}>
                    {formatDisplay(selected)}
                </span>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white border main-border rounded-lg shadow-lg p-4 w-96">
                    <div className="flex gap-6">
                        <div className="flex-1">
                            <DatePicker
                                selected={internalDate || undefined}
                                onChange={handleDateChange}
                                locale={dateFnsLocale}
                                inline
                                calendarClassName="!border-0 !shadow-none p-0"
                                dayClassName={(date) => {
                                    const isSelected = internalDate &&
                                        date.getDate() === internalDate.getDate() &&
                                        date.getMonth() === internalDate.getMonth() &&
                                        date.getFullYear() === internalDate.getFullYear();

                                    return `text-center py-2 rounded ${
                                        isSelected
                                            ? 'bg-blue-600 text-white hover:!bg-blue-600'
                                            : 'hover:bg-gray-100'
                                    }`;
                                }}
                                weekDayClassName={() => "text-gray-500 text-sm py-2"}
                                {...(locale === 'tk' ? {
                                    formatWeekDay: () => ""
                                } : {})}
                                renderCustomHeader={({
                                                         date,
                                                         decreaseMonth,
                                                         increaseMonth,
                                                         prevMonthButtonDisabled,
                                                         nextMonthButtonDisabled
                                                     }) => (
                                    <>
                                        <div className="flex justify-between items-center mb-2">
                                            <button
                                                onClick={decreaseMonth}
                                                disabled={prevMonthButtonDisabled}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                ‹
                                            </button>
                                            <div className="font-medium">
                                                {getLocalizedMonthName(date)}
                                            </div>
                                            <button
                                                onClick={increaseMonth}
                                                disabled={nextMonthButtonDisabled}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                ›
                                            </button>
                                        </div>
                                        {locale === 'tk' && renderWeekDays()}
                                    </>
                                )}
                                {...(locale === 'tk' ? {
                                    showMonthDropdown: false,
                                    showYearDropdown: false
                                } : {})}
                            />
                        </div>

                        <div className="w-32 border-l pl-4">
                            <div className="flex items-center gap-2 mb-3 text-gray-600">
                                <FaRegClock className="h-4 w-4" />
                                <span className="text-sm font-medium">{t('time')}</span>
                            </div>

                            <div className="h-64 overflow-y-auto">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={`${slot.hour}-${slot.minute}`}
                                        onClick={() => handleTimeChange(slot.hour, slot.minute)}
                                        className={`w-full text-left px-2 py-1.5 text-sm rounded mb-1 ${
                                            internalDate &&
                                            internalDate.getHours() === slot.hour &&
                                            internalDate.getMinutes() === slot.minute
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {slot.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
                        <button
                            onClick={handleApply}
                            disabled={!internalDate}
                            className={`px-3 py-1.5 text-sm border rounded cursor-pointer ${!internalDate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        >
                            {t('apply')}
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="sidebar-color text-white cursor-pointer px-2 py-1 rounded-md"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}