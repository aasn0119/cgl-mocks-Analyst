const DashboardCard = ({
    title,
    value,
    subtitle = '',
    icon = '📊',
    color = 'from-indigo-500 to-blue-500',
}) => {
    return (
        <div
            className={`
                bg-gradient-to-br ${color}
                rounded-2xl
                p-4
                text-white
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                min-h-[110px]
                flex flex-col justify-between
            `}
        >
            {/* TOP ROW */}
            <div className="flex items-center justify-between">
                <span className="text-xl">{icon}</span>

                <span className="text-[10px] uppercase tracking-wider opacity-80">
                    Metric
                </span>
            </div>

            {/* VALUE */}
            <div>
                <p className="text-xs opacity-80">{title}</p>

                <h3 className="text-xl font-bold leading-tight mt-1">
                    {value}
                </h3>

                {subtitle && (
                    <p className="text-[11px] opacity-80 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
