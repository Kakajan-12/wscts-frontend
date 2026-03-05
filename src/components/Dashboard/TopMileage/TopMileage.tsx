import {useTranslations} from "next-intl";

const HorizontalBar = ({value, max, label, valueLabel, color}: {
    value: number;
    max: number;
    label: string;
    valueLabel: string;
    color: string;
}) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className="flex items-center space-x-4 mb-3">
            <div className="w-32 text-sm text-gray-700 truncate">{label}</div>
            <div className="flex-1">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    <div
                        className={`h-full ${color} rounded-full`}
                        style={{width: `${percentage}%`}}
                    />
                </div>
            </div>
            <div className="w-20 text-right font-medium">{valueLabel}</div>
        </div>
    );
};
export default function TopMileage({
                                       topMileage = [
                                           {name: 'Shantui Excavator 9m', mileage: 37},
                                           {name: 'Shantui Excavator 10m', mileage: 13},
                                           {name: 'Shantui Excavator 9m', mileage: 18},
                                           {name: 'Shantui Excavator 9m', mileage: 30}
                                       ]
                                   }) {
    const t = useTranslations('Dashboard');
    return (
        <div className="bg-white rounded-xl shadow">
            <div
                className="flex items-center justify-between mb-4 bg-[#065F46] rounded-tr-xl rounded-tl-xl px-4 py-1">
                <h3 className="text-lg font-semibold text-white">{t('top-mileage')}</h3>
            </div>

            <div className="space-y-3 px-4 py-1">
                {topMileage.map((vehicle, index) => (
                    <HorizontalBar
                        key={index}
                        value={vehicle.mileage}
                        max={300}
                        label={vehicle.name}
                        valueLabel={`${vehicle.mileage} ${t('km')}`}
                        color="bg-[#17886899]"
                    />
                ))}
            </div>
        </div>
    )
}