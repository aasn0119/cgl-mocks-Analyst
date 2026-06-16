export const buildLeaderboard = (users, mocks) => {
    const map = {};

    // INIT USERS
    users.forEach((u) => {
        map[u.uid] = {
            uid: u.uid,
            name: u.displayName,
            photoURL: u.photoURL,
            totalMocks: 0,
            totalScore: 0,
            bestScore: 0,
            totalAccuracy: 0,
        };
    });

    // AGGREGATE MOCKS
    mocks.forEach((m) => {
        if (!map[m.userId]) return;

        map[m.userId].totalMocks += 1;
        map[m.userId].totalScore += Number(m.totalScore || 0);
        map[m.userId].totalAccuracy += Number(m.accuracy || 0);

        map[m.userId].bestScore = Math.max(
            map[m.userId].bestScore,
            Number(m.totalScore || 0)
        );
    });

    // FINALIZE AVERAGES
    const result = Object.values(map).map((u) => ({
        ...u,
        avgScore: u.totalMocks ? (u.totalScore / u.totalMocks).toFixed(2) : 0,
        avgAccuracy: u.totalMocks
            ? (u.totalAccuracy / u.totalMocks).toFixed(2)
            : 0,
    }));

    return result;
};
