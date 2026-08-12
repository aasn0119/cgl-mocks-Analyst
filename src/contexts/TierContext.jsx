import { createContext, useContext, useEffect, useState } from 'react';
import { TIERS, getPattern } from '../config/examPatterns';

const TierContext = createContext();

export const useTier = () => useContext(TierContext);

export const TierProvider = ({ children }) => {
    const [tier, setTier] = useState(
        localStorage.getItem('examTier') || TIERS.tier1
    );

    useEffect(() => {
        localStorage.setItem('examTier', tier);
    }, [tier]);

    const toggleTier = () =>
        setTier((prev) => (prev === TIERS.tier1 ? TIERS.tier2 : TIERS.tier1));

    const pattern = getPattern(tier);

    return (
        <TierContext.Provider value={{ tier, setTier, toggleTier, pattern }}>
            {children}
        </TierContext.Provider>
    );
};
