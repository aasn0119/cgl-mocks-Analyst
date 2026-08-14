import JsonImportWidget from '../jsonImport/JsonImportWidget';

const HeroSection = ({ userName, totalMocks, readiness, userId }) => {
    return (
        <div
            className="
                bg-gradient-to-r
                from-indigo-600
                via-blue-600
                to-cyan-500
                rounded-3xl
                p-5
                sm:p-6
                md:p-8
                shadow-2xl
                text-white
            "
        >
            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-6
                "
            >
                {/* LEFT CONTENT */}
                <div className="min-w-0">
                    <h1
                        className="
                            text-2xl
                            sm:text-3xl
                            md:text-4xl
                            font-extrabold
                            leading-tight
                        "
                    >
                        Welcome Back 👋
                    </h1>

                    <p
                        className="
                            mt-2
                            sm:mt-3
                            text-indigo-100
                            text-sm
                            sm:text-base
                            md:text-lg
                            leading-relaxed
                        "
                    >
                        {userName
                            ? `Keep pushing forward, ${userName}.`
                            : 'Track your SSC CGL preparation journey.'}
                    </p>
                </div>

                {/* RIGHT SECTION */}
                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        lg:flex-row
                        items-stretch
                        sm:items-center
                        gap-4
                        w-full
                        lg:w-auto
                    "
                >
                    {/* STATS */}
                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-3
                            sm:gap-4
                            w-full
                            sm:w-auto
                        "
                    >
                        <div
                            className="
                                bg-white/15
                                backdrop-blur-md
                                rounded-2xl
                                px-4
                                py-3
                                sm:px-5
                                sm:py-4
                                min-w-0
                            "
                        >
                            <p className="text-xs sm:text-sm opacity-90">
                                Total Mocks
                            </p>

                            <h3
                                className="
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    mt-0.5
                                    truncate
                                "
                            >
                                {totalMocks}
                            </h3>
                        </div>

                        <div
                            className="
                                bg-white/15
                                backdrop-blur-md
                                rounded-2xl
                                px-4
                                py-3
                                sm:px-5
                                sm:py-4
                                min-w-0
                            "
                        >
                            <p className="text-xs sm:text-sm opacity-90">
                                Readiness
                            </p>

                            <h3
                                className="
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    mt-0.5
                                    truncate
                                "
                            >
                                {readiness}
                            </h3>
                        </div>
                    </div>

                    {/* IMPORT BUTTON */}
                    <div
                        className="
                            w-full
                            sm:w-auto
                            lg:ml-2
                            flex
                            justify-center
                            sm:justify-start
                        "
                    >
                        <JsonImportWidget userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
