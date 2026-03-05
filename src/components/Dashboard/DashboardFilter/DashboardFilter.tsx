import {useTranslations} from "next-intl";
import {useState} from "react";
import {DatePickerField} from "@/src/components/Dashboard/DatePickerField";
import {Button} from "@headlessui/react";

export default function DashboardFilter(){
    const t = useTranslations("Filter");
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const handlePeriodClick = (period: 'yesterday' | 'today' | 'week' | 'month') => {
        const now = new Date();
        const start = new Date();

        switch (period) {
            case 'yesterday':
                start.setDate(now.getDate() - 1);
                start.setHours(0, 0, 0, 0);
                setStartDate(start);
                setEndDate(new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1));
                break;

            case 'today':
                start.setHours(0, 0, 0, 0);
                setStartDate(start);
                setEndDate(now);
                break;

            case 'week':
                start.setDate(now.getDate() - 7);
                start.setHours(0, 0, 0, 0);
                setStartDate(start);
                setEndDate(now);
                break;

            case 'month':
                start.setMonth(now.getMonth() - 1);
                start.setHours(0, 0, 0, 0);
                setStartDate(start);
                setEndDate(now);
                break;
        }
    };

    return (
        <div className="flex space-x-4 items-center">
            <div className="border main-border rounded-md px-2 py-1 flex items-center space-x-4">
                <button
                    className="font-medium hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={() => handlePeriodClick('yesterday')}
                >
                    {t('yesterday')}
                </button>
                <button
                    className="font-medium hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={() => handlePeriodClick('today')}
                >
                    {t('today')}
                </button>
                <button
                    className="font-medium hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={() => handlePeriodClick('week')}
                >
                    {t('week')}
                </button>
                <button
                    className="font-medium hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={() => handlePeriodClick('month')}
                >
                    {t('month')}
                </button>
            </div>

            <div className="flex space-x-4 items-center">
                <div className="flex space-x-2 items-center">
                    <div className="font-medium">{t('at')}</div>
                    <DatePickerField
                        selected={startDate}
                        onChange={setStartDate}
                        placeholder={t('date')}
                    />
                </div>
                <div className="flex space-x-2 items-center">
                    <div className="font-medium">{t('to')}</div>
                    <DatePickerField
                        selected={endDate}
                        onChange={setEndDate}
                        placeholder={t('date')}
                    />
                </div>
                <div>
                    <Button className="sidebar-color text-white px-4 py-2 rounded-md cursor-pointer">
                        {t('reset')}
                    </Button>
                </div>
            </div>
        </div>
    )
}