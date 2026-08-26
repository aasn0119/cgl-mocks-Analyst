import { EXAM_PATTERNS } from './examPatterns';

// ─────────────────────────────────────────────────────────────
// SSC CGL SYLLABUS CONFIGURATION
// ─────────────────────────────────────────────────────────────
//
// Structure:
//
//   Tier
//     └── Subject
//           └── Chapter
//                 └── Sub-topic
//
// Example:
//
//   Tier 1
//     └── Quantitative Aptitude
//           └── Number System
//                 ├── Number System
//                 ├── Whole Numbers
//                 ├── Integers
//                 └── HCF & LCM
//
// IMPORTANT:
// • Existing subject keys are preserved.
// • Existing topic IDs are preserved wherever possible.
// • Topic IDs must remain stable because they are used by
//   Firestore to store completed topics.
// • Array indexes must NEVER be used as progress IDs.
// • Chapters are organizational units and do not need their
//   own Firestore progress entry.
// • Chapter progress is calculated automatically from its topics.
//
// ─────────────────────────────────────────────────────────────

export const SYLLABUS = {
    // =========================================================
    // TIER 1
    // =========================================================

    tier1: {
        // -----------------------------------------------------
        // QUANTITATIVE APTITUDE
        // -----------------------------------------------------
        quantScore: {
            key: 'quantScore',
            label: 'Quantitative Aptitude',
            shortLabel: 'Quant',
            icon: '🔢',
            color: 'blue',

            chapters: [
                {
                    id: 'number-system',
                    label: 'Number System',
                    icon: '🔢',
                    description:
                        'Build a strong foundation in numbers and their properties.',
                    topics: [
                        { id: 'number-system', label: 'Number System' },
                        { id: 'whole-numbers', label: 'Whole Numbers' },
                        { id: 'integers', label: 'Integers' },
                        { id: 'fractions', label: 'Fractions' },
                        { id: 'decimals', label: 'Decimals' },
                        { id: 'divisibility', label: 'Divisibility Rules' },
                        {
                            id: 'factors-multiples',
                            label: 'Factors & Multiples',
                        },
                        { id: 'hcf-lcm', label: 'HCF & LCM' },
                        {
                            id: 'square-square-root',
                            label: 'Squares & Square Roots',
                        },
                        {
                            id: 'cube-cube-root',
                            label: 'Cubes & Cube Roots',
                        },
                    ],
                },

                {
                    id: 'arithmetic',
                    label: 'Arithmetic',
                    icon: '➗',
                    description:
                        'Master the core arithmetic concepts used throughout SSC CGL.',
                    topics: [
                        {
                            id: 'simplification',
                            label: 'Simplification & BODMAS',
                        },
                        { id: 'percentage', label: 'Percentage' },
                        {
                            id: 'ratio-proportion',
                            label: 'Ratio & Proportion',
                        },
                        { id: 'average', label: 'Average' },
                        {
                            id: 'profit-loss',
                            label: 'Profit, Loss & Discount',
                        },
                        {
                            id: 'simple-compound-interest',
                            label: 'Simple & Compound Interest',
                        },
                        { id: 'partnership', label: 'Partnership' },
                        {
                            id: 'mixture-alligation',
                            label: 'Mixture & Alligation',
                        },
                        { id: 'time-work', label: 'Time & Work' },
                        {
                            id: 'pipes-cisterns',
                            label: 'Pipes & Cisterns',
                        },
                        {
                            id: 'time-speed-distance',
                            label: 'Time, Speed & Distance',
                        },
                        {
                            id: 'boats-streams',
                            label: 'Boats & Streams',
                        },
                        { id: 'trains', label: 'Problems on Trains' },
                        { id: 'ages', label: 'Problems on Ages' },
                    ],
                },

                {
                    id: 'algebra',
                    label: 'Algebra',
                    icon: '📐',
                    description:
                        'Develop command over algebraic expressions, identities and equations.',
                    topics: [
                        {
                            id: 'algebra-basics',
                            label: 'Basic Algebraic Identities',
                        },
                        {
                            id: 'algebra-identities',
                            label: 'Algebraic Identities',
                        },
                        {
                            id: 'linear-equations',
                            label: 'Linear Equations',
                        },
                        {
                            id: 'surds-indices',
                            label: 'Surds & Indices',
                        },
                    ],
                },

                {
                    id: 'geometry',
                    label: 'Geometry',
                    icon: '📐',
                    description:
                        'Understand geometric properties, figures and relationships.',
                    topics: [
                        {
                            id: 'geometry-lines-angles',
                            label: 'Lines & Angles',
                        },
                        {
                            id: 'geometry-triangles',
                            label: 'Triangles',
                        },
                        {
                            id: 'geometry-quadrilaterals',
                            label: 'Quadrilaterals & Polygons',
                        },
                        {
                            id: 'geometry-circles',
                            label: 'Circles',
                        },
                        {
                            id: 'geometry-congruence-similarity',
                            label: 'Congruence & Similarity',
                        },
                    ],
                },

                {
                    id: 'mensuration',
                    label: 'Mensuration',
                    icon: '📏',
                    description:
                        'Learn areas, perimeters, volumes and surface areas of figures.',
                    topics: [
                        {
                            id: 'mensuration-2d',
                            label: 'Mensuration — 2D Figures',
                        },
                        {
                            id: 'mensuration-3d',
                            label: 'Mensuration — 3D Figures',
                        },
                        {
                            id: 'area-perimeter',
                            label: 'Area & Perimeter',
                        },
                        {
                            id: 'volume-surface-area',
                            label: 'Volume & Surface Area',
                        },
                    ],
                },

                {
                    id: 'trigonometry',
                    label: 'Trigonometry',
                    icon: '📐',
                    description:
                        'Master trigonometric ratios, identities and applications.',
                    topics: [
                        {
                            id: 'trigonometry-basics',
                            label: 'Basic Trigonometric Ratios',
                        },
                        {
                            id: 'trigonometric-identities',
                            label: 'Trigonometric Identities',
                        },
                        {
                            id: 'height-distance',
                            label: 'Heights & Distances',
                        },
                    ],
                },

                {
                    id: 'data-interpretation',
                    label: 'Data Interpretation',
                    icon: '📊',
                    description:
                        'Interpret numerical information presented through different charts.',
                    topics: [
                        {
                            id: 'data-interpretation-tables',
                            label: 'Data Interpretation — Tables',
                        },
                        {
                            id: 'data-interpretation-bar',
                            label: 'Data Interpretation — Bar Graphs',
                        },
                        {
                            id: 'data-interpretation-pie',
                            label: 'Data Interpretation — Pie Charts',
                        },
                        {
                            id: 'data-interpretation-line',
                            label: 'Data Interpretation — Line Graphs',
                        },
                    ],
                },

                {
                    id: 'statistics',
                    label: 'Statistics & Charts',
                    icon: '📈',
                    description:
                        'Understand basic statistical representation and charts.',
                    topics: [
                        {
                            id: 'statistical-charts',
                            label: 'Statistical Charts & Graphs',
                        },
                    ],
                },
            ],
        },

        // -----------------------------------------------------
        // GENERAL INTELLIGENCE & REASONING
        // -----------------------------------------------------
        reasoningScore: {
            key: 'reasoningScore',
            label: 'General Intelligence & Reasoning',
            shortLabel: 'Reasoning',
            icon: '🧠',
            color: 'purple',

            chapters: [
                {
                    id: 'analogy-classification',
                    label: 'Analogy & Classification',
                    icon: '🔗',
                    description:
                        'Identify relationships and classify objects, numbers and figures.',
                    topics: [
                        {
                            id: 'analogy',
                            label: 'Analogy',
                        },
                        {
                            id: 'classification',
                            label: 'Classification',
                        },
                    ],
                },

                {
                    id: 'series',
                    label: 'Series',
                    icon: '🔢',
                    description:
                        'Identify patterns in numerical, alphabetical and alphanumeric sequences.',
                    topics: [
                        {
                            id: 'number-series',
                            label: 'Number Series',
                        },
                        {
                            id: 'alphabet-series',
                            label: 'Alphabet Series',
                        },
                        {
                            id: 'alphanumeric-series',
                            label: 'Alphanumeric Series',
                        },
                    ],
                },

                {
                    id: 'coding-decoding',
                    label: 'Coding & Decoding',
                    icon: '🔐',
                    description:
                        'Learn different coding patterns and decoding techniques.',
                    topics: [
                        {
                            id: 'coding-decoding',
                            label: 'Coding-Decoding',
                        },
                        {
                            id: 'letter-coding',
                            label: 'Letter Coding',
                        },
                        {
                            id: 'number-coding',
                            label: 'Number Coding',
                        },
                    ],
                },

                {
                    id: 'relations-direction',
                    label: 'Relations, Direction & Ranking',
                    icon: '🧭',
                    description:
                        'Solve questions involving relationships, directions and rankings.',
                    topics: [
                        {
                            id: 'blood-relations',
                            label: 'Blood Relations',
                        },
                        {
                            id: 'direction-sense',
                            label: 'Direction Sense',
                        },
                        {
                            id: 'ranking-order',
                            label: 'Ranking & Order',
                        },
                    ],
                },

                {
                    id: 'logical-reasoning',
                    label: 'Logical Reasoning',
                    icon: '💡',
                    description:
                        'Develop structured reasoning and logical deduction skills.',
                    topics: [
                        {
                            id: 'syllogism',
                            label: 'Syllogism',
                        },
                        {
                            id: 'statement-conclusion',
                            label: 'Statement & Conclusion',
                        },
                        {
                            id: 'statement-assumption',
                            label: 'Statement & Assumption',
                        },
                        {
                            id: 'cause-effect',
                            label: 'Cause & Effect',
                        },
                        {
                            id: 'decision-making',
                            label: 'Decision Making',
                        },
                    ],
                },

                {
                    id: 'venn-diagrams',
                    label: 'Venn Diagrams',
                    icon: '⭕',
                    description:
                        'Understand set relationships through visual representation.',
                    topics: [
                        {
                            id: 'venn-diagrams',
                            label: 'Venn Diagrams',
                        },
                    ],
                },

                {
                    id: 'arrangement-puzzles',
                    label: 'Arrangements & Puzzles',
                    icon: '🧩',
                    description:
                        'Solve arrangement-based and logical puzzle questions.',
                    topics: [
                        {
                            id: 'seating-arrangement',
                            label: 'Seating Arrangement',
                        },
                        {
                            id: 'linear-arrangement',
                            label: 'Linear Arrangement',
                        },
                        {
                            id: 'circular-arrangement',
                            label: 'Circular Arrangement',
                        },
                        {
                            id: 'puzzle',
                            label: 'Puzzles',
                        },
                    ],
                },

                {
                    id: 'non-verbal-reasoning',
                    label: 'Non-Verbal Reasoning',
                    icon: '🧩',
                    description:
                        'Develop visual reasoning and figure-based problem solving.',
                    topics: [
                        {
                            id: 'figure-classification',
                            label: 'Figure Classification',
                        },
                        {
                            id: 'mirror-images',
                            label: 'Mirror Images',
                        },
                        {
                            id: 'water-images',
                            label: 'Water Images',
                        },
                        {
                            id: 'paper-folding',
                            label: 'Paper Folding',
                        },
                        {
                            id: 'paper-cutting',
                            label: 'Paper Cutting',
                        },
                        {
                            id: 'figure-completion',
                            label: 'Figure Completion',
                        },
                        {
                            id: 'embedded-figures',
                            label: 'Embedded Figures',
                        },
                        {
                            id: 'figure-counting',
                            label: 'Figure Counting',
                        },
                    ],
                },

                {
                    id: 'miscellaneous-reasoning',
                    label: 'Miscellaneous Reasoning',
                    icon: '🧮',
                    description:
                        'Additional reasoning concepts frequently used in competitive exams.',
                    topics: [
                        {
                            id: 'missing-number',
                            label: 'Missing Number',
                        },
                        {
                            id: 'arithmetic-reasoning',
                            label: 'Arithmetical Reasoning',
                        },
                        {
                            id: 'word-building',
                            label: 'Word Building',
                        },
                        {
                            id: 'dictionary-order',
                            label: 'Dictionary Order',
                        },
                        {
                            id: 'mathematical-operations',
                            label: 'Mathematical Operations',
                        },
                        {
                            id: 'clock-calendar',
                            label: 'Clock & Calendar',
                        },
                    ],
                },
            ],
        },

        // -----------------------------------------------------
        // ENGLISH LANGUAGE
        // -----------------------------------------------------
        englishScore: {
            key: 'englishScore',
            label: 'English Language',
            shortLabel: 'English',
            icon: '📖',
            color: 'emerald',

            chapters: [
                {
                    id: 'grammar',
                    label: 'Grammar',
                    icon: '✍️',
                    description:
                        'Build a strong command of English grammar and sentence structure.',
                    topics: [
                        {
                            id: 'grammar-tenses',
                            label: 'Tenses',
                        },
                        {
                            id: 'subject-verb-agreement',
                            label: 'Subject-Verb Agreement',
                        },
                        {
                            id: 'noun',
                            label: 'Noun',
                        },
                        {
                            id: 'pronoun',
                            label: 'Pronoun',
                        },
                        {
                            id: 'adjective',
                            label: 'Adjective',
                        },
                        {
                            id: 'adverb',
                            label: 'Adverb',
                        },
                        {
                            id: 'verb',
                            label: 'Verb',
                        },
                        {
                            id: 'conjunction',
                            label: 'Conjunction',
                        },
                        {
                            id: 'prepositions',
                            label: 'Prepositions',
                        },
                        {
                            id: 'articles',
                            label: 'Articles',
                        },
                        {
                            id: 'modals',
                            label: 'Modals',
                        },
                        {
                            id: 'active-passive',
                            label: 'Active & Passive Voice',
                        },
                        {
                            id: 'direct-indirect',
                            label: 'Direct & Indirect Speech',
                        },
                    ],
                },

                {
                    id: 'vocabulary',
                    label: 'Vocabulary',
                    icon: '📚',
                    description: 'Expand vocabulary and improve word usage.',
                    topics: [
                        {
                            id: 'synonyms',
                            label: 'Synonyms',
                        },
                        {
                            id: 'antonyms',
                            label: 'Antonyms',
                        },
                        {
                            id: 'one-word-substitution',
                            label: 'One-Word Substitution',
                        },
                        {
                            id: 'idioms-phrases',
                            label: 'Idioms & Phrases',
                        },
                        {
                            id: 'spelling-correction',
                            label: 'Spelling Correction',
                        },
                    ],
                },

                {
                    id: 'sentence-correction',
                    label: 'Sentence Correction',
                    icon: '📝',
                    description:
                        'Improve accuracy in sentence-based questions.',
                    topics: [
                        {
                            id: 'error-spotting',
                            label: 'Spotting Errors',
                        },
                        {
                            id: 'sentence-improvement',
                            label: 'Sentence Improvement',
                        },
                        {
                            id: 'fill-blanks',
                            label: 'Fill in the Blanks',
                        },
                        {
                            id: 'sentence-rearrangement',
                            label: 'Sentence Rearrangement',
                        },
                        {
                            id: 'para-jumbles',
                            label: 'Para Jumbles',
                        },
                    ],
                },

                {
                    id: 'comprehension',
                    label: 'Comprehension',
                    icon: '📄',
                    description:
                        'Develop reading speed, comprehension and contextual understanding.',
                    topics: [
                        {
                            id: 'cloze-test',
                            label: 'Cloze Test',
                        },
                        {
                            id: 'reading-comprehension',
                            label: 'Reading Comprehension',
                        },
                    ],
                },
            ],
        },

        // -----------------------------------------------------
        // GENERAL AWARENESS
        // -----------------------------------------------------
        gkScore: {
            key: 'gkScore',
            label: 'General Awareness',
            shortLabel: 'GK',
            icon: '🌍',
            color: 'orange',

            chapters: [
                {
                    id: 'history',
                    label: 'History',
                    icon: '🏛️',
                    description:
                        'Study major periods and movements in Indian history.',
                    topics: [
                        {
                            id: 'ancient-history',
                            label: 'Ancient Indian History',
                        },
                        {
                            id: 'medieval-history',
                            label: 'Medieval Indian History',
                        },
                        {
                            id: 'modern-history',
                            label: 'Modern Indian History',
                        },
                        {
                            id: 'indian-national-movement',
                            label: 'Indian National Movement',
                        },
                        {
                            id: 'freedom-struggle',
                            label: 'Freedom Struggle',
                        },
                    ],
                },

                {
                    id: 'geography',
                    label: 'Geography',
                    icon: '🌏',
                    description:
                        'Understand physical, Indian and world geography.',
                    topics: [
                        {
                            id: 'physical-geography',
                            label: 'Physical Geography',
                        },
                        {
                            id: 'indian-geography',
                            label: 'Indian Geography',
                        },
                        {
                            id: 'world-geography',
                            label: 'World Geography',
                        },
                        {
                            id: 'rivers-dams',
                            label: 'Rivers, Dams & Water Resources',
                        },
                        {
                            id: 'climate-weather',
                            label: 'Climate & Weather',
                        },
                        {
                            id: 'soil-agriculture',
                            label: 'Soils & Agriculture',
                        },
                        {
                            id: 'minerals-industries',
                            label: 'Minerals & Industries',
                        },
                    ],
                },

                {
                    id: 'polity',
                    label: 'Indian Polity',
                    icon: '⚖️',
                    description:
                        'Understand the Constitution, government institutions and governance.',
                    topics: [
                        {
                            id: 'indian-polity',
                            label: 'Indian Polity',
                        },
                        {
                            id: 'constitution',
                            label: 'Indian Constitution',
                        },
                        {
                            id: 'fundamental-rights',
                            label: 'Fundamental Rights',
                        },
                        {
                            id: 'directive-principles',
                            label: 'Directive Principles of State Policy',
                        },
                        {
                            id: 'fundamental-duties',
                            label: 'Fundamental Duties',
                        },
                        {
                            id: 'president-vice-president',
                            label: 'President & Vice-President',
                        },
                        {
                            id: 'parliament',
                            label: 'Parliament',
                        },
                        {
                            id: 'supreme-court-high-court',
                            label: 'Supreme Court & High Courts',
                        },
                        {
                            id: 'constitutional-bodies',
                            label: 'Constitutional Bodies',
                        },
                        {
                            id: 'elections',
                            label: 'Election System',
                        },
                        {
                            id: 'local-government',
                            label: 'Local Government & Panchayati Raj',
                        },
                    ],
                },

                {
                    id: 'economy',
                    label: 'Indian Economy',
                    icon: '💰',
                    description:
                        'Learn fundamental economic concepts and Indian financial systems.',
                    topics: [
                        {
                            id: 'economics-basics',
                            label: 'Basic Economics',
                        },
                        {
                            id: 'indian-economy',
                            label: 'Indian Economy',
                        },
                        {
                            id: 'national-income',
                            label: 'National Income',
                        },
                        {
                            id: 'inflation',
                            label: 'Inflation',
                        },
                        {
                            id: 'banking',
                            label: 'Banking & Financial System',
                        },
                        {
                            id: 'budget',
                            label: 'Union Budget',
                        },
                        {
                            id: 'taxation',
                            label: 'Taxation',
                        },
                        {
                            id: 'monetary-fiscal-policy',
                            label: 'Monetary & Fiscal Policy',
                        },
                    ],
                },

                {
                    id: 'general-science',
                    label: 'General Science',
                    icon: '🔬',
                    description:
                        'Cover essential concepts from Physics, Chemistry and Biology.',
                    topics: [
                        {
                            id: 'physics',
                            label: 'General Science — Physics',
                        },
                        {
                            id: 'chemistry',
                            label: 'General Science — Chemistry',
                        },
                        {
                            id: 'biology',
                            label: 'General Science — Biology',
                        },
                        {
                            id: 'human-body',
                            label: 'Human Body & Diseases',
                        },
                        {
                            id: 'environment',
                            label: 'Environment & Ecology',
                        },
                    ],
                },

                {
                    id: 'static-gk',
                    label: 'Static GK',
                    icon: '📚',
                    description:
                        'Build knowledge of important static facts and cultural information.',
                    topics: [
                        {
                            id: 'static-gk',
                            label: 'Static GK',
                        },
                        {
                            id: 'national-parks',
                            label: 'National Parks & Wildlife Sanctuaries',
                        },
                        {
                            id: 'important-days',
                            label: 'Important Days',
                        },
                        {
                            id: 'books-authors',
                            label: 'Books & Authors',
                        },
                        {
                            id: 'awards-honours',
                            label: 'Awards & Honours',
                        },
                        {
                            id: 'capitals-currencies',
                            label: 'Countries, Capitals & Currencies',
                        },
                        {
                            id: 'dances-culture',
                            label: 'Indian Dance, Art & Culture',
                        },
                        {
                            id: 'sports',
                            label: 'Sports',
                        },
                    ],
                },

                {
                    id: 'current-affairs',
                    label: 'Current Affairs',
                    icon: '📰',
                    description:
                        'Track important national and international developments.',
                    topics: [
                        {
                            id: 'current-affairs',
                            label: 'Current Affairs',
                        },
                        {
                            id: 'government-schemes',
                            label: 'Government Schemes & Programmes',
                        },
                        {
                            id: 'important-appointments',
                            label: 'Important Appointments',
                        },
                        {
                            id: 'international-affairs',
                            label: 'International Affairs',
                        },
                    ],
                },
            ],
        },
    },

    // =========================================================
    // TIER 2
    // =========================================================

    tier2: {
        // -----------------------------------------------------
        // MATHEMATICAL ABILITIES
        // -----------------------------------------------------
        quantScore: {
            key: 'quantScore',
            label: 'Mathematical Abilities',
            shortLabel: 'Quant',
            icon: '🔢',
            color: 'blue',

            chapters: [
                {
                    id: 'number-system',
                    label: 'Number System',
                    icon: '🔢',
                    description:
                        'Master numbers and their fundamental properties.',
                    topics: [
                        {
                            id: 'number-system',
                            label: 'Number System',
                        },
                        {
                            id: 'whole-numbers',
                            label: 'Whole Numbers',
                        },
                        {
                            id: 'integers',
                            label: 'Integers',
                        },
                        {
                            id: 'fractions',
                            label: 'Fractions',
                        },
                        {
                            id: 'decimals',
                            label: 'Decimals',
                        },
                        {
                            id: 'hcf-lcm',
                            label: 'HCF & LCM',
                        },
                        {
                            id: 'divisibility',
                            label: 'Divisibility',
                        },
                    ],
                },

                {
                    id: 'arithmetic',
                    label: 'Arithmetic',
                    icon: '➗',
                    description:
                        'Master advanced arithmetic concepts and applications.',
                    topics: [
                        {
                            id: 'simplification',
                            label: 'Simplification',
                        },
                        {
                            id: 'percentage',
                            label: 'Percentage',
                        },
                        {
                            id: 'ratio-proportion',
                            label: 'Ratio & Proportion',
                        },
                        {
                            id: 'average',
                            label: 'Average',
                        },
                        {
                            id: 'profit-loss',
                            label: 'Profit, Loss & Discount',
                        },
                        {
                            id: 'simple-compound-interest',
                            label: 'Simple & Compound Interest',
                        },
                        {
                            id: 'partnership',
                            label: 'Partnership',
                        },
                        {
                            id: 'mixture-alligation',
                            label: 'Mixture & Alligation',
                        },
                        {
                            id: 'time-work-pipes',
                            label: 'Time, Work & Pipes/Cisterns',
                        },
                        {
                            id: 'time-speed-distance',
                            label: 'Time, Speed & Distance',
                        },
                        {
                            id: 'boats-streams',
                            label: 'Boats & Streams',
                        },
                        {
                            id: 'trains',
                            label: 'Problems on Trains',
                        },
                        {
                            id: 'ages',
                            label: 'Problems on Ages',
                        },
                    ],
                },

                {
                    id: 'algebra',
                    label: 'Algebra',
                    icon: '📐',
                    description:
                        'Develop deeper understanding of algebraic concepts.',
                    topics: [
                        {
                            id: 'algebra-advanced',
                            label: 'Algebra',
                        },
                        {
                            id: 'algebra-identities',
                            label: 'Algebraic Identities',
                        },
                        {
                            id: 'linear-equations',
                            label: 'Linear Equations',
                        },
                        {
                            id: 'surds-indices',
                            label: 'Surds & Indices',
                        },
                    ],
                },

                {
                    id: 'geometry',
                    label: 'Geometry',
                    icon: '📐',
                    description:
                        'Master geometric properties and theorem-based concepts.',
                    topics: [
                        {
                            id: 'geometry-lines-angles',
                            label: 'Lines & Angles',
                        },
                        {
                            id: 'geometry-triangles',
                            label: 'Triangles',
                        },
                        {
                            id: 'geometry-congruence-similarity',
                            label: 'Congruence & Similarity',
                        },
                        {
                            id: 'geometry-quadrilaterals',
                            label: 'Quadrilaterals & Polygons',
                        },
                        {
                            id: 'geometry-circles',
                            label: 'Circles',
                        },
                    ],
                },

                {
                    id: 'mensuration',
                    label: 'Mensuration',
                    icon: '📏',
                    description:
                        'Solve advanced area, perimeter, volume and surface-area problems.',
                    topics: [
                        {
                            id: 'mensuration-2d',
                            label: 'Mensuration — 2D Figures',
                        },
                        {
                            id: 'mensuration-3d',
                            label: 'Mensuration — 3D Figures',
                        },
                        {
                            id: 'area-perimeter',
                            label: 'Area & Perimeter',
                        },
                        {
                            id: 'volume-surface-area',
                            label: 'Volume & Surface Area',
                        },
                    ],
                },

                {
                    id: 'trigonometry',
                    label: 'Trigonometry',
                    icon: '📐',
                    description:
                        'Build advanced command over trigonometric concepts.',
                    topics: [
                        {
                            id: 'trigonometry-advanced',
                            label: 'Trigonometry',
                        },
                        {
                            id: 'trigonometric-ratios',
                            label: 'Trigonometric Ratios',
                        },
                        {
                            id: 'trigonometric-identities',
                            label: 'Trigonometric Identities',
                        },
                        {
                            id: 'height-distance',
                            label: 'Heights & Distances',
                        },
                    ],
                },

                {
                    id: 'data-interpretation',
                    label: 'Data Interpretation',
                    icon: '📊',
                    description:
                        'Interpret and analyze numerical data presented in different formats.',
                    topics: [
                        {
                            id: 'data-interpretation-tables',
                            label: 'Data Interpretation — Tables',
                        },
                        {
                            id: 'data-interpretation-bar',
                            label: 'Data Interpretation — Bar Graphs',
                        },
                        {
                            id: 'data-interpretation-pie',
                            label: 'Data Interpretation — Pie Charts',
                        },
                        {
                            id: 'data-interpretation-line',
                            label: 'Data Interpretation — Line Graphs',
                        },
                    ],
                },

                {
                    id: 'statistics',
                    label: 'Statistics',
                    icon: '📈',
                    description:
                        'Understand statistical measures and graphical representation.',
                    topics: [
                        {
                            id: 'statistics-basics',
                            label: 'Statistics — Mean, Median & Mode',
                        },
                        {
                            id: 'statistical-charts',
                            label: 'Statistical Charts',
                        },
                    ],
                },

                {
                    id: 'coordinate-geometry',
                    label: 'Coordinate Geometry',
                    icon: '📍',
                    description:
                        'Work with coordinates and geometric relationships on a plane.',
                    topics: [
                        {
                            id: 'coordinate-geometry',
                            label: 'Coordinate Geometry',
                        },
                    ],
                },
            ],
        },

        // -----------------------------------------------------
        // REASONING & GENERAL INTELLIGENCE
        // -----------------------------------------------------
        reasoningScore: {
            key: 'reasoningScore',
            label: 'Reasoning & General Intelligence',
            shortLabel: 'Reasoning',
            icon: '🧠',
            color: 'purple',

            chapters: [
                {
                    id: 'analogy-classification',
                    label: 'Analogy & Classification',
                    icon: '🔗',
                    description:
                        'Identify relationships and classify information logically.',
                    topics: [
                        {
                            id: 'analogy',
                            label: 'Analogy',
                        },
                        {
                            id: 'classification',
                            label: 'Classification',
                        },
                    ],
                },

                {
                    id: 'series',
                    label: 'Series',
                    icon: '🔢',
                    description:
                        'Identify patterns across different types of sequences.',
                    topics: [
                        {
                            id: 'number-series',
                            label: 'Number Series',
                        },
                        {
                            id: 'alphabet-series',
                            label: 'Alphabet Series',
                        },
                        {
                            id: 'alphanumeric-series',
                            label: 'Alphanumeric Series',
                        },
                    ],
                },

                {
                    id: 'coding-decoding',
                    label: 'Coding & Decoding',
                    icon: '🔐',
                    description:
                        'Solve coded relationships using systematic patterns.',
                    topics: [
                        {
                            id: 'coding-decoding',
                            label: 'Coding-Decoding',
                        },
                    ],
                },

                {
                    id: 'relations-direction',
                    label: 'Relations, Direction & Ranking',
                    icon: '🧭',
                    description:
                        'Solve relationship, direction and ranking problems.',
                    topics: [
                        {
                            id: 'blood-relations',
                            label: 'Blood Relations',
                        },
                        {
                            id: 'direction-sense',
                            label: 'Direction Sense',
                        },
                        {
                            id: 'ranking-order',
                            label: 'Ranking & Order',
                        },
                    ],
                },

                {
                    id: 'logical-reasoning',
                    label: 'Logical Reasoning',
                    icon: '💡',
                    description:
                        'Strengthen deduction and structured logical thinking.',
                    topics: [
                        {
                            id: 'syllogism',
                            label: 'Syllogism',
                        },
                        {
                            id: 'statement-conclusion',
                            label: 'Statement & Conclusion',
                        },
                        {
                            id: 'statement-assumption',
                            label: 'Statement & Assumption',
                        },
                        {
                            id: 'cause-effect',
                            label: 'Cause & Effect',
                        },
                        {
                            id: 'decision-making',
                            label: 'Decision Making',
                        },
                    ],
                },

                {
                    id: 'venn-diagrams',
                    label: 'Venn Diagrams',
                    icon: '⭕',
                    description: 'Represent logical relationships visually.',
                    topics: [
                        {
                            id: 'venn-diagrams',
                            label: 'Venn Diagrams',
                        },
                    ],
                },

                {
                    id: 'advanced-puzzles',
                    label: 'Advanced Arrangements & Puzzles',
                    icon: '🧩',
                    description:
                        'Handle complex arrangement and multi-condition puzzles.',
                    topics: [
                        {
                            id: 'seating-arrangement',
                            label: 'Seating Arrangement',
                        },
                        {
                            id: 'linear-arrangement',
                            label: 'Linear Arrangement',
                        },
                        {
                            id: 'circular-arrangement',
                            label: 'Circular Arrangement',
                        },
                        {
                            id: 'puzzle-advanced',
                            label: 'Advanced Puzzles',
                        },
                        {
                            id: 'floor-puzzle',
                            label: 'Floor-Based Puzzles',
                        },
                        {
                            id: 'box-puzzle',
                            label: 'Box-Based Puzzles',
                        },
                    ],
                },

                {
                    id: 'non-verbal-reasoning',
                    label: 'Non-Verbal Reasoning',
                    icon: '🧩',
                    description:
                        'Develop visual reasoning through figures and transformations.',
                    topics: [
                        {
                            id: 'mirror-images',
                            label: 'Mirror Images',
                        },
                        {
                            id: 'water-images',
                            label: 'Water Images',
                        },
                        {
                            id: 'paper-folding',
                            label: 'Paper Folding',
                        },
                        {
                            id: 'paper-cutting',
                            label: 'Paper Cutting',
                        },
                        {
                            id: 'embedded-figures',
                            label: 'Embedded Figures',
                        },
                        {
                            id: 'figure-completion',
                            label: 'Figure Completion',
                        },
                        {
                            id: 'figure-counting',
                            label: 'Figure Counting',
                        },
                    ],
                },

                {
                    id: 'miscellaneous-reasoning',
                    label: 'Miscellaneous Reasoning',
                    icon: '🧮',
                    description:
                        'Additional reasoning concepts and problem types.',
                    topics: [
                        {
                            id: 'missing-number',
                            label: 'Missing Number',
                        },
                        {
                            id: 'arithmetic-reasoning',
                            label: 'Arithmetical Reasoning',
                        },
                        {
                            id: 'mathematical-operations',
                            label: 'Mathematical Operations',
                        },
                        {
                            id: 'clock-calendar',
                            label: 'Clock & Calendar',
                        },
                        {
                            id: 'word-building',
                            label: 'Word Building',
                        },
                        {
                            id: 'dictionary-order',
                            label: 'Dictionary Order',
                        },
                    ],
                },
            ],
        },

        // -----------------------------------------------------
        // ENGLISH LANGUAGE & COMPREHENSION
        // -----------------------------------------------------
        englishScore: {
            key: 'englishScore',
            label: 'English Language & Comprehension',
            shortLabel: 'English',
            icon: '📖',
            color: 'emerald',

            chapters: [
                {
                    id: 'grammar',
                    label: 'Grammar',
                    icon: '✍️',
                    description:
                        'Build strong command over advanced English grammar.',
                    topics: [
                        {
                            id: 'grammar-advanced',
                            label: 'Grammar',
                        },
                        {
                            id: 'tenses',
                            label: 'Tenses',
                        },
                        {
                            id: 'subject-verb-agreement',
                            label: 'Subject-Verb Agreement',
                        },
                        {
                            id: 'noun',
                            label: 'Noun',
                        },
                        {
                            id: 'pronoun',
                            label: 'Pronoun',
                        },
                        {
                            id: 'adjective',
                            label: 'Adjective',
                        },
                        {
                            id: 'adverb',
                            label: 'Adverb',
                        },
                        {
                            id: 'verb',
                            label: 'Verb',
                        },
                        {
                            id: 'prepositions',
                            label: 'Prepositions',
                        },
                        {
                            id: 'articles',
                            label: 'Articles',
                        },
                        {
                            id: 'conjunction',
                            label: 'Conjunction',
                        },
                        {
                            id: 'modals',
                            label: 'Modals',
                        },
                        {
                            id: 'active-passive',
                            label: 'Active & Passive Voice',
                        },
                        {
                            id: 'direct-indirect',
                            label: 'Direct & Indirect Speech',
                        },
                    ],
                },

                {
                    id: 'vocabulary',
                    label: 'Vocabulary',
                    icon: '📚',
                    description:
                        'Strengthen vocabulary and contextual word usage.',
                    topics: [
                        {
                            id: 'synonyms',
                            label: 'Synonyms',
                        },
                        {
                            id: 'antonyms',
                            label: 'Antonyms',
                        },
                        {
                            id: 'one-word-substitution',
                            label: 'One-Word Substitution',
                        },
                        {
                            id: 'idioms-phrases',
                            label: 'Idioms & Phrases',
                        },
                        {
                            id: 'phrasal-verbs',
                            label: 'Phrasal Verbs',
                        },
                        {
                            id: 'spelling-correction',
                            label: 'Spelling Correction',
                        },
                    ],
                },

                {
                    id: 'sentence-based',
                    label: 'Sentence Based Questions',
                    icon: '📝',
                    description:
                        'Improve accuracy in error detection and sentence correction.',
                    topics: [
                        {
                            id: 'error-spotting',
                            label: 'Spotting Errors',
                        },
                        {
                            id: 'sentence-improvement',
                            label: 'Sentence Improvement',
                        },
                        {
                            id: 'fill-blanks',
                            label: 'Fill in the Blanks',
                        },
                        {
                            id: 'sentence-rearrangement',
                            label: 'Sentence Rearrangement',
                        },
                        {
                            id: 'para-jumbles',
                            label: 'Para Jumbles',
                        },
                    ],
                },

                {
                    id: 'comprehension',
                    label: 'Comprehension',
                    icon: '📄',
                    description:
                        'Develop reading comprehension and passage-solving ability.',
                    topics: [
                        {
                            id: 'cloze-test',
                            label: 'Cloze Test',
                        },
                        {
                            id: 'reading-comprehension',
                            label: 'Reading Comprehension',
                        },
                        {
                            id: 'long-reading-comprehension',
                            label: 'Long Passage Comprehension',
                        },
                    ],
                },
            ],
        },

        // -----------------------------------------------------
        // GENERAL AWARENESS
        // -----------------------------------------------------
        gkScore: {
            key: 'gkScore',
            label: 'General Awareness',
            shortLabel: 'GK',
            icon: '🌍',
            color: 'orange',

            chapters: [
                {
                    id: 'history',
                    label: 'History',
                    icon: '🏛️',
                    description:
                        'Cover major periods and movements in Indian history.',
                    topics: [
                        {
                            id: 'ancient-history',
                            label: 'Ancient Indian History',
                        },
                        {
                            id: 'medieval-history',
                            label: 'Medieval Indian History',
                        },
                        {
                            id: 'modern-history',
                            label: 'Modern Indian History',
                        },
                        {
                            id: 'indian-national-movement',
                            label: 'Indian National Movement',
                        },
                        {
                            id: 'freedom-struggle',
                            label: 'Freedom Struggle',
                        },
                    ],
                },

                {
                    id: 'geography',
                    label: 'Geography',
                    icon: '🌏',
                    description:
                        'Understand physical, Indian and world geography.',
                    topics: [
                        {
                            id: 'physical-geography',
                            label: 'Physical Geography',
                        },
                        {
                            id: 'indian-geography',
                            label: 'Indian Geography',
                        },
                        {
                            id: 'world-geography',
                            label: 'World Geography',
                        },
                        {
                            id: 'rivers-dams',
                            label: 'Rivers, Dams & Water Resources',
                        },
                        {
                            id: 'climate-weather',
                            label: 'Climate & Weather',
                        },
                        {
                            id: 'soil-agriculture',
                            label: 'Soils & Agriculture',
                        },
                        {
                            id: 'minerals-industries',
                            label: 'Minerals & Industries',
                        },
                    ],
                },

                {
                    id: 'polity',
                    label: 'Indian Polity',
                    icon: '⚖️',
                    description:
                        'Understand the Constitution, institutions and governance.',
                    topics: [
                        {
                            id: 'indian-polity',
                            label: 'Indian Polity',
                        },
                        {
                            id: 'constitution',
                            label: 'Indian Constitution',
                        },
                        {
                            id: 'fundamental-rights',
                            label: 'Fundamental Rights',
                        },
                        {
                            id: 'directive-principles',
                            label: 'Directive Principles of State Policy',
                        },
                        {
                            id: 'fundamental-duties',
                            label: 'Fundamental Duties',
                        },
                        {
                            id: 'president-vice-president',
                            label: 'President & Vice-President',
                        },
                        {
                            id: 'parliament',
                            label: 'Parliament',
                        },
                        {
                            id: 'supreme-court-high-court',
                            label: 'Supreme Court & High Courts',
                        },
                        {
                            id: 'constitutional-bodies',
                            label: 'Constitutional Bodies',
                        },
                        {
                            id: 'elections',
                            label: 'Election System',
                        },
                        {
                            id: 'local-government',
                            label: 'Local Government & Panchayati Raj',
                        },
                    ],
                },

                {
                    id: 'economy',
                    label: 'Indian Economy',
                    icon: '💰',
                    description:
                        'Understand the fundamentals of economics and finance.',
                    topics: [
                        {
                            id: 'economics-basics',
                            label: 'Basic Economics',
                        },
                        {
                            id: 'indian-economy',
                            label: 'Indian Economy',
                        },
                        {
                            id: 'national-income',
                            label: 'National Income',
                        },
                        {
                            id: 'inflation',
                            label: 'Inflation',
                        },
                        {
                            id: 'banking',
                            label: 'Banking & Financial System',
                        },
                        {
                            id: 'budget',
                            label: 'Union Budget',
                        },
                        {
                            id: 'taxation',
                            label: 'Taxation',
                        },
                        {
                            id: 'monetary-fiscal-policy',
                            label: 'Monetary & Fiscal Policy',
                        },
                    ],
                },

                {
                    id: 'general-science',
                    label: 'General Science',
                    icon: '🔬',
                    description:
                        'Cover essential Physics, Chemistry and Biology concepts.',
                    topics: [
                        {
                            id: 'physics',
                            label: 'General Science — Physics',
                        },
                        {
                            id: 'chemistry',
                            label: 'General Science — Chemistry',
                        },
                        {
                            id: 'biology',
                            label: 'General Science — Biology',
                        },
                        {
                            id: 'human-body',
                            label: 'Human Body & Diseases',
                        },
                        {
                            id: 'environment',
                            label: 'Environment & Ecology',
                        },
                    ],
                },

                {
                    id: 'static-gk',
                    label: 'Static GK',
                    icon: '📚',
                    description:
                        'Build knowledge of important static facts and cultural information.',
                    topics: [
                        {
                            id: 'static-gk',
                            label: 'Static GK',
                        },
                        {
                            id: 'national-parks',
                            label: 'National Parks & Wildlife Sanctuaries',
                        },
                        {
                            id: 'important-days',
                            label: 'Important Days',
                        },
                        {
                            id: 'books-authors',
                            label: 'Books & Authors',
                        },
                        {
                            id: 'awards-honours',
                            label: 'Awards & Honours',
                        },
                        {
                            id: 'capitals-currencies',
                            label: 'Countries, Capitals & Currencies',
                        },
                        {
                            id: 'dances-culture',
                            label: 'Indian Dance, Art & Culture',
                        },
                        {
                            id: 'sports',
                            label: 'Sports',
                        },
                    ],
                },

                {
                    id: 'current-affairs',
                    label: 'Current Affairs',
                    icon: '📰',
                    description:
                        'Track important national and international developments.',
                    topics: [
                        {
                            id: 'current-affairs',
                            label: 'Current Affairs',
                        },
                        {
                            id: 'government-schemes',
                            label: 'Government Schemes & Policies',
                        },
                        {
                            id: 'important-appointments',
                            label: 'Important Appointments',
                        },
                        {
                            id: 'international-affairs',
                            label: 'International Affairs',
                        },
                    ],
                },
            ],
        },
    },
};

// ─────────────────────────────────────────────────────────────
// TIER / SUBJECT HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Returns the complete syllabus object for a tier.
 */
export const getSyllabusForTier = (tier) => SYLLABUS[tier] || {};

/**
 * Returns a subject configuration.
 */
export const getSubject = (tier, subjectKey) =>
    SYLLABUS[tier]?.[subjectKey] || null;

/**
 * Returns all configured subjects for a tier as an array.
 */
export const getSubjectsForTier = (tier) => Object.values(SYLLABUS[tier] || {});

/**
 * Returns all chapters belonging to a subject.
 */
export const getChaptersForSubject = (tier, subjectKey) =>
    SYLLABUS[tier]?.[subjectKey]?.chapters || [];

/**
 * Returns all topics belonging to a chapter.
 */
export const getTopicsForChapter = (tier, subjectKey, chapterId) => {
    const chapter = getChaptersForSubject(tier, subjectKey).find(
        (item) => item.id === chapterId
    );

    return chapter?.topics || [];
};

/**
 * Returns a flat list of all topics in a subject.
 *
 * This is useful for calculating subject-level progress.
 */
export const getTopicsForSubject = (tier, subjectKey) =>
    getChaptersForSubject(tier, subjectKey).flatMap(
        (chapter) => chapter.topics || []
    );

/**
 * Returns the number of topics in a chapter.
 */
export const getChapterTopicCount = (tier, subjectKey, chapterId) =>
    getTopicsForChapter(tier, subjectKey, chapterId).length;

/**
 * Returns the total number of topics in a subject.
 */
export const getTopicCount = (tier, subjectKey) =>
    getTopicsForSubject(tier, subjectKey).length;

/**
 * Returns the number of chapters in a subject.
 */
export const getChapterCount = (tier, subjectKey) =>
    getChaptersForSubject(tier, subjectKey).length;

/**
 * Returns the total number of topics across an entire tier.
 *
 * This is the denominator for the overall progress calculation.
 */
export const getTotalTopicCount = (tier) =>
    getSubjectsForTier(tier).reduce(
        (total, subject) => total + getTopicCount(tier, subject.key),
        0
    );

/**
 * Returns the total number of chapters across an entire tier.
 */
export const getTotalChapterCount = (tier) =>
    getSubjectsForTier(tier).reduce(
        (total, subject) => total + getChapterCount(tier, subject.key),
        0
    );

/**
 * Finds a topic anywhere inside a tier.
 *
 * Useful for achievement logic, topic lookup and future
 * features such as search.
 */
export const findTopic = (tier, topicId) => {
    const subjects = getSubjectsForTier(tier);

    for (const subject of subjects) {
        for (const chapter of subject.chapters || []) {
            const topic = chapter.topics?.find((item) => item.id === topicId);

            if (topic) {
                return {
                    ...topic,
                    tier,
                    subjectKey: subject.key,
                    subjectLabel: subject.label,
                    chapterId: chapter.id,
                    chapterLabel: chapter.label,
                };
            }
        }
    }

    return null;
};

/**
 * Finds a chapter anywhere inside a tier.
 */
export const findChapter = (tier, chapterId) => {
    const subjects = getSubjectsForTier(tier);

    for (const subject of subjects) {
        const chapter = subject.chapters?.find((item) => item.id === chapterId);

        if (chapter) {
            return {
                ...chapter,
                tier,
                subjectKey: subject.key,
                subjectLabel: subject.label,
            };
        }
    }

    return null;
};

// ─────────────────────────────────────────────────────────────
// PROGRESS HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Calculates the completion percentage of a chapter.
 *
 * `completedSet` should be a Set containing completed topic IDs.
 */
export const getChapterProgress = (
    tier,
    subjectKey,
    chapterId,
    completedSet = new Set()
) => {
    const topics = getTopicsForChapter(tier, subjectKey, chapterId);

    if (!topics.length) {
        return 0;
    }

    const completed = topics.filter((topic) =>
        completedSet.has(topic.id)
    ).length;

    return Math.round((completed / topics.length) * 100);
};

/**
 * Calculates detailed chapter statistics.
 */
export const getChapterStats = (
    tier,
    subjectKey,
    chapterId,
    completedSet = new Set()
) => {
    const topics = getTopicsForChapter(tier, subjectKey, chapterId);

    const completedCount = topics.filter((topic) =>
        completedSet.has(topic.id)
    ).length;

    const totalCount = topics.length;

    return {
        completedCount,
        totalCount,
        remainingCount: Math.max(totalCount - completedCount, 0),
        percent: totalCount
            ? Math.round((completedCount / totalCount) * 100)
            : 0,
        isComplete: totalCount > 0 && completedCount === totalCount,
    };
};

/**
 * Calculates detailed subject statistics.
 */
export const getSubjectStats = (tier, subjectKey, completedSet = new Set()) => {
    const subject = getSubject(tier, subjectKey);

    if (!subject) {
        return {
            completedCount: 0,
            totalCount: 0,
            remainingCount: 0,
            percent: 0,
            chapterCount: 0,
            completedChapters: 0,
            isComplete: false,
        };
    }

    const chapters = subject.chapters || [];

    const topics = chapters.flatMap((chapter) => chapter.topics || []);

    const completedCount = topics.filter((topic) =>
        completedSet.has(topic.id)
    ).length;

    const totalCount = topics.length;

    const completedChapters = chapters.filter((chapter) => {
        const chapterTopics = chapter.topics || [];

        return (
            chapterTopics.length > 0 &&
            chapterTopics.every((topic) => completedSet.has(topic.id))
        );
    }).length;

    return {
        completedCount,
        totalCount,
        remainingCount: Math.max(totalCount - completedCount, 0),
        percent: totalCount
            ? Math.round((completedCount / totalCount) * 100)
            : 0,
        chapterCount: chapters.length,
        completedChapters,
        remainingChapters: Math.max(chapters.length - completedChapters, 0),
        isComplete: totalCount > 0 && completedCount === totalCount,
    };
};

/**
 * Calculates complete tier statistics.
 */
export const getTierStats = (tier, completedProgress = {}) => {
    const subjects = getSubjectsForTier(tier);

    let totalTopics = 0;
    let completedTopics = 0;
    let totalChapters = 0;
    let completedChapters = 0;

    subjects.forEach((subject) => {
        const completedSet = new Set(completedProgress?.[subject.key] || []);

        const stats = getSubjectStats(tier, subject.key, completedSet);

        totalTopics += stats.totalCount;
        completedTopics += stats.completedCount;
        totalChapters += stats.chapterCount;
        completedChapters += stats.completedChapters;
    });

    return {
        totalTopics,
        completedTopics,
        remainingTopics: Math.max(totalTopics - completedTopics, 0),

        totalChapters,
        completedChapters,
        remainingChapters: Math.max(totalChapters - completedChapters, 0),

        percent: totalTopics
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0,

        isComplete: totalTopics > 0 && completedTopics === totalTopics,
    };
};

// ─────────────────────────────────────────────────────────────
// SEARCH / NAVIGATION HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Searches all subjects, chapters and topics within a tier.
 *
 * The future syllabus UI can use this for a global search box.
 */
export const searchSyllabus = (tier, query = '') => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return [];
    }

    const results = [];

    getSubjectsForTier(tier).forEach((subject) => {
        subject.chapters?.forEach((chapter) => {
            chapter.topics?.forEach((topic) => {
                const topicMatch = topic.label
                    .toLowerCase()
                    .includes(normalizedQuery);

                const chapterMatch = chapter.label
                    .toLowerCase()
                    .includes(normalizedQuery);

                const subjectMatch = subject.label
                    .toLowerCase()
                    .includes(normalizedQuery);

                if (topicMatch || chapterMatch || subjectMatch) {
                    results.push({
                        topic,
                        chapter: {
                            id: chapter.id,
                            label: chapter.label,
                            icon: chapter.icon,
                        },
                        subject: {
                            key: subject.key,
                            label: subject.label,
                            shortLabel: subject.shortLabel,
                            icon: subject.icon,
                            color: subject.color,
                        },
                    });
                }
            });
        });
    });

    return results;
};

// ─────────────────────────────────────────────────────────────
// BACKWARD COMPATIBILITY
// ─────────────────────────────────────────────────────────────
//
// Older parts of the application may still expect:
//
//     getTopicsForSubject(tier, subjectKey)
//
// That helper is intentionally preserved above.
//
// Older mock documents may also have no tier field. That logic
// belongs to examPatterns.js, so it remains untouched here.
//
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// EXAM PATTERN HELPER
// ─────────────────────────────────────────────────────────────
//
// Returns the exam pattern for the requested tier.
//
// The syllabus tracker uses the same tier identifiers as the
// rest of the application:
//
//     tier1
//     tier2
//
// Keeping this helper here makes it easy for components/hooks
// to safely retrieve the correct pattern without directly
// accessing EXAM_PATTERNS everywhere.
//
// If an invalid/undefined tier is supplied, Tier 1 is used as
// the safe fallback.
// ─────────────────────────────────────────────────────────────

export const getPattern = (tier) =>
    EXAM_PATTERNS?.[tier] || EXAM_PATTERNS?.tier1;
