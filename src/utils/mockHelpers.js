export const getUserMocks = (mocks, uid) => {
    console.log('getUserMocks called with uid:', uid);
    console.log('Available mocks:', mocks);
    if (!Array.isArray(mocks)) return [];

    return mocks
        .filter((m) => m?.userId === uid)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};
