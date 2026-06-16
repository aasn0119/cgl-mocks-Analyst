export const buildScoreTrend = (mocks) => {
    return [...mocks]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((m) => ({
            date: new Date(m.date).toLocaleDateString(),
            score: Number(m.totalScore || 0),
        }));
};

export const buildAccuracyTrend = (mocks) => {
    return [...mocks]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((m) => ({
            date: new Date(m.date).toLocaleDateString(),
            accuracy: Number(m.accuracy || 0),
        }));
};

export const buildSubjectPerformance = (mocks) => {
    const subjects = {
        English: 0,
        Reasoning: 0,
        Quant: 0,
        GK: 0,
        count: 0,
    };

    mocks.forEach((m) => {
        subjects.English += Number(m.englishScore || 0);
        subjects.Reasoning += Number(m.reasoningScore || 0);
        subjects.Quant += Number(m.quantScore || 0);
        subjects.GK += Number(m.gkScore || 0);
        subjects.count += 1;
    });

    return [
        { subject: 'English', value: subjects.English / subjects.count || 0 },
        {
            subject: 'Reasoning',
            value: subjects.Reasoning / subjects.count || 0,
        },
        { subject: 'Quant', value: subjects.Quant / subjects.count || 0 },
        { subject: 'GK', value: subjects.GK / subjects.count || 0 },
    ];
};

export const buildPlatformPerformance = (mocks) => {
    const map = {};

    mocks.forEach((m) => {
        if (!map[m.platform]) {
            map[m.platform] = { total: 0, count: 0 };
        }

        map[m.platform].total += Number(m.totalScore || 0);
        map[m.platform].count += 1;
    });

    return Object.entries(map).map(([platform, data]) => ({
        platform,
        avgScore: data.total / data.count,
    }));
};
