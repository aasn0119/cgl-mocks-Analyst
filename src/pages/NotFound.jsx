import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowRight,
    FaBookOpen,
    FaHome,
    FaGraduationCap,
    FaLightbulb,
    FaStar,
    FaInfinity,
} from 'react-icons/fa';
import { FaAtom } from 'react-icons/fa6';

import './NotFound.css';

const particles = Array.from({ length: 42 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    top: `${(i * 61) % 100}%`,
    size: `${2 + ((i * 7) % 4)}px`,
    delay: `${(i % 9) * 0.55}s`,
    duration: `${4 + (i % 6)}s`,
}));

const floatingItems = [
    {
        type: 'book',
        className: 'nf-book book-1',
        rotate: '-14deg',
    },
    {
        type: 'book',
        className: 'nf-book book-2',
        rotate: '12deg',
    },
    {
        type: 'book',
        className: 'nf-book book-3',
        rotate: '-8deg',
    },
    {
        type: 'book',
        className: 'nf-book book-4',
        rotate: '17deg',
    },
];

const symbols = [
    { value: 'π', className: 'symbol symbol-1' },
    { value: '√x', className: 'symbol symbol-2' },
    { value: 'Σ', className: 'symbol symbol-3' },
    { value: 'f(x)', className: 'symbol symbol-4' },
    { value: 'E = mc²', className: 'symbol symbol-5' },
    { value: 'a² + b² = c²', className: 'symbol symbol-6' },
    { value: '∞', className: 'symbol symbol-7' },
];

const NotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found-page">
            {/* =========================================================
                BACKGROUND
            ========================================================= */}

            <div className="nf-background" />

            <div className="nf-grid" />

            <div className="nf-vignette" />

            {/* Ambient glowing orbs */}
            <div className="ambient-orb orb-blue" />
            <div className="ambient-orb orb-purple" />
            <div className="ambient-orb orb-gold" />

            {/* =========================================================
                PARTICLES
            ========================================================= */}

            <div className="particles">
                {particles.map((particle) => (
                    <span
                        key={particle.id}
                        className="particle"
                        style={{
                            left: particle.left,
                            top: particle.top,
                            width: particle.size,
                            height: particle.size,
                            animationDelay: particle.delay,
                            animationDuration: particle.duration,
                        }}
                    />
                ))}
            </div>

            {/* =========================================================
                TOP LIGHT BEAM
            ========================================================= */}

            <div className="light-beam">
                <div className="beam-ring beam-ring-1" />
                <div className="beam-ring beam-ring-2" />
                <div className="beam-ring beam-ring-3" />
            </div>

            {/* =========================================================
                FLOATING ACADEMIC SYMBOLS
            ========================================================= */}

            <div className="symbol-layer">
                {symbols.map((symbol) => (
                    <div key={symbol.className} className={symbol.className}>
                        {symbol.value}
                    </div>
                ))}
            </div>

            {/* =========================================================
                FLOATING BOOKS
            ========================================================= */}

            <div className="floating-books">
                {floatingItems.map((book) => (
                    <div
                        key={book.className}
                        className={book.className}
                        style={{
                            '--book-rotate': book.rotate,
                        }}
                    >
                        <div className="book-cover">
                            <FaBookOpen />
                        </div>

                        <div className="book-page book-page-1" />
                        <div className="book-page book-page-2" />
                        <div className="book-page book-page-3" />
                    </div>
                ))}
            </div>

            {/* =========================================================
                ORBITING ELEMENTS
            ========================================================= */}

            <div className="orbit orbit-outer">
                <div className="orbit-dot">
                    <FaStar />
                </div>
            </div>

            <div className="orbit orbit-inner">
                <div className="orbit-dot orbit-dot-purple">
                    <FaLightbulb />
                </div>
            </div>

            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}

            <main className="not-found-content">
                {/* Small top label */}
                <div className="nf-top-label">
                    <span className="label-line" />

                    <span className="label-content">
                        <FaGraduationCap />
                        <span>SSC ANALYTICS</span>
                    </span>

                    <span className="label-line" />
                </div>

                {/* Main message */}
                <div className="nf-heading-wrapper">
                    <p className="nf-eyebrow">
                        Oops! You've wandered off the study path.
                    </p>

                    <div className="error-number">
                        <span className="four four-blue">4</span>

                        <span className="zero">
                            <span className="zero-glow" />
                            <span className="zero-inner">0</span>

                            {/* Small orbit inside zero */}
                            <span className="zero-orbit">
                                <span className="zero-orbit-dot" />
                            </span>
                        </span>

                        <span className="four four-gold">4</span>
                    </div>

                    <h1 className="nf-title">Page Not Found</h1>

                    <p className="nf-description">
                        The page you're looking for seems to have disappeared
                        into another dimension.
                    </p>

                    <p className="nf-sub-description">
                        Don't worry — let's get you back on track.
                    </p>
                </div>

                {/* =====================================================
                    ACTION BUTTON
                ===================================================== */}

                <button
                    type="button"
                    className="dashboard-button"
                    onClick={goHome}
                >
                    <span className="button-icon">
                        <FaHome />
                    </span>

                    <span className="button-text">Back to Dashboard</span>

                    <span className="button-arrow">
                        <FaArrowRight />
                    </span>

                    <span className="button-shine" />
                </button>

                {/* =====================================================
                    LOWER STUDY AREA
                ===================================================== */}

                <div className="study-scene">
                    {/* Globe */}
                    <div className="study-globe">
                        <div className="globe-ring globe-ring-1" />
                        <div className="globe-ring globe-ring-2" />

                        <div className="globe-sphere">
                            <span>🌍</span>
                        </div>
                    </div>

                    {/* Stack of books */}
                    <div className="book-stack">
                        <div className="stack-book stack-book-1">
                            <span>QUANT</span>
                        </div>

                        <div className="stack-book stack-book-2">
                            <span>REASONING</span>
                        </div>

                        <div className="stack-book stack-book-3">
                            <span>ENGLISH</span>
                        </div>

                        <div className="stack-book stack-book-4">
                            <span>GK</span>
                        </div>
                    </div>

                    {/* Open magical book */}
                    <div className="open-book">
                        <div className="book-left">
                            <span>∑</span>
                            <small>Keep learning...</small>
                        </div>

                        <div className="book-right">
                            <span>π</span>
                            <small>Keep improving.</small>
                        </div>

                        <div className="book-spine" />

                        <div className="book-glow" />
                    </div>

                    {/* Pencil holder */}
                    <div className="pencil-holder">
                        <span>✎</span>
                        <span>✏</span>
                        <span>🖊</span>
                    </div>
                </div>

                {/* =====================================================
                    BOTTOM QUOTE CARD
                ===================================================== */}

                <div className="quote-card">
                    <div className="quote-icon">“</div>

                    <div className="quote-text">
                        <p>
                            Every wrong turn is just another chance to get back
                            on track.
                        </p>

                        <span>— SSC Analytics</span>
                    </div>

                    <FaInfinity className="quote-infinity" />
                </div>

                <div className="page-indicators">
                    <span />
                    <span className="active" />
                    <span />
                </div>
            </main>
        </div>
    );
};

export default NotFound;
