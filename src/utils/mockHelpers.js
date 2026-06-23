export const getUserMocks = (mocks, uid) => {
    if (!Array.isArray(mocks)) return [];

    return mocks
        .filter((m) => m?.userId === uid)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};
