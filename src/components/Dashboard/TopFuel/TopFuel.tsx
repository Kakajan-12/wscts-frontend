import {useTranslations} from "next-intl";

const HorizontalBar = ({label, valueLabel, color}: {
    value: string;
    max: number;
    label: string;
    valueLabel: string;
    color: string;
}) => {

    return (
        <div className="flex items-center space-x-4 mb-3">
            <div className="w-32 text-sm text-gray-700 truncate">{label}</div>
            <div className="flex-1">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                        className={`h-full ${color} rounded-full`}
                    />
                </div>
            </div>
            <div className="w-20 text-right font-medium">{valueLabel}</div>
        </div>
    );
};

export default function TopFuel({
                                    topFuelConsumption = [
                                        {name: 'Shantui Excavator 9m', consumption: '59%'},
                                        {name: 'Shantui Excavator 18m', consumption: '25%'},
                                        {name: 'Shantui Excavator 9m', consumption: '12%'},
                                        {name: 'Shantui Excavator 15m', consumption: '65%'}
                                    ],
                                }) {
    const t = useTranslations("Dashboard")
    return (
        <div className="bg-white rounded-xl shadow">
            <div
                className="flex items-center justify-between mb-4 bg-[#065F46] rounded-tr-xl rounded-tl-xl px-4 py-1">
                <h3 className="text-lg font-medium text-white">{t('top-fuel-consumption')}</h3>
            </div>

            <div className="space-y-3 px-4 py-1">

                {topFuelConsumption.map((vehicle, index) => (
                    <HorizontalBar
                        key={index}
                        value={vehicle.consumption}
                        max={1000}
                        label={vehicle.name}
                        valueLabel={`${vehicle.consumption} ${t('litre')}`}
                        color="bg-[#17886899]"
                    />
                ))}
            </div>
        </div>
    )
}