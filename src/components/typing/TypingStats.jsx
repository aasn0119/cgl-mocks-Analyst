import {
    FaBullseye,
    FaClock,
    FaExclamationTriangle,
    FaTachometerAlt,
} from 'react-icons/fa';

const TypingStats = ({ time, wpm, accuracy, errors }) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<FaClock />} label="Time left" value={time} />
        <Stat icon={<FaTachometerAlt />} label="Gross WPM" value={wpm} />
        <Stat icon={<FaBullseye />} label="Accuracy" value={`${accuracy}%`} />
        <Stat
            icon={<FaExclamationTriangle />}
            label="Word errors"
            value={errors}
        />
    </div>
);

const Stat = ({ icon, label, value }) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/50">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="text-indigo-500">{icon}</span>
            {label}
        </div>
        <p className="mt-1 text-xl font-extrabold text-slate-800 dark:text-slate-100">
            {value}
        </p>
    </div>
);

export default TypingStats;
