const TypingPassage = ({ text, typed, highlight }) => {
    if (!highlight) {
        return <p className="whitespace-pre-line">{text}</p>;
    }

    return (
        <div className="whitespace-pre-line">
            {text.split('').map((character, index) => {
                const entered = typed[index];
                const state =
                    entered === undefined
                        ? 'pending'
                        : entered === character
                          ? 'correct'
                          : 'wrong';
                return (
                    <span
                        key={`${index}-${character}`}
                        className={
                            state === 'correct'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : state === 'wrong'
                                  ? 'rounded-sm bg-rose-200 text-rose-700 dark:bg-rose-500/30 dark:text-rose-300'
                                  : 'text-slate-700 dark:text-slate-300'
                        }
                    >
                        {character}
                    </span>
                );
            })}
        </div>
    );
};

export default TypingPassage;
