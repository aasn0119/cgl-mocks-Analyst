import { getMockTier } from '../config/examPatterns';

export const getUserMocks = (mocks, uid) => {
    if (!Array.isArray(mocks)) return [];

    return mocks
        .filter((m) => m?.userId === uid)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getUserMocksForTier = (mocks, uid, tier) => {
    if (!Array.isArray(mocks)) return [];

    return mocks
        .filter((m) => m?.userId === uid && getMockTier(m) === tier)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};
