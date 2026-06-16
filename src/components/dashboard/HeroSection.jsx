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
                p-8
                shadow-2xl
                text-white
            "
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* LEFT CONTENT */}
                <div>
                    <h1 className="text-4xl font-extrabold">Welcome Back 👋</h1>

                    <p className="mt-3 text-indigo-100 text-lg">
                        {userName
                            ? `Keep pushing forward, ${userName}.`
                            : 'Track your SSC CGL preparation journey.'}
                    </p>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-4">
                    {/* STATS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-4">
                            <p className="text-sm opacity-90">Total Mocks</p>
                            <h3 className="text-2xl font-bold">{totalMocks}</h3>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-4">
                            <p className="text-sm opacity-90">Readiness</p>
                            <h3 className="text-2xl font-bold">{readiness}</h3>
                        </div>
                    </div>

                    {/* IMPORT BUTTON */}
                    <div className="ml-2 cursor-pointer">
                        <JsonImportWidget userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
