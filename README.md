# 🏆 SSC CGL Mock Test Analytics

A comprehensive **mock test tracking and analytics platform** designed for **SSC CGL aspirants**. Track your preparation journey with detailed performance insights, compare with peers, and stay motivated with leaderboards and progress tracking.

> **Built with:** React 19, Vite, Tailwind CSS v4, Firebase, Recharts, Framer Motion

---

## 📸 Screenshots

<!-- Add screenshots here -->

---

## ✨ Features

### 🔐 Authentication

- **Google Sign-In** via Firebase Authentication
- Secure, seamless login/logout flow
- Auto-redirect for authenticated users

### 📊 Dashboard

| Feature                  | Description                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero Section**         | Personalized welcome with total mocks & readiness status                                                                             |
| **Target Tracker**       | Visual progress bar toward target score (default: 160)                                                                               |
| **Stats Grid**           | 9 key metrics: Total Mocks, Best Score, Avg Accuracy, Improvement %, Current/Best Streak, Readiness, Predicted Score, Avg Percentile |
| **Subject Intelligence** | Per-subject average scores with progress bars & best/weak identification                                                             |
| **Performance Charts**   | Score trend, accuracy trend, subject-wise trends (Quant, Reasoning, English, GK)                                                     |
| **Recent Mocks**         | Expandable mock cards with compare mode (select 2 to compare side-by-side)                                                           |
| **Reports Section**      | Weekly & monthly performance summaries + platform ranking with weighted scoring                                                      |
| **JSON Import**          | Bulk upload mock data from JSON files directly from dashboard                                                                        |

### 📝 Mocks Management

- **Add Mock Test** — Comprehensive form with:
    - Date, platform, mock ID
    - Total score (0–200, supports .5 increments)
    - Subject scores (English, Reasoning, Quant, GK — each out of 50)
    - Rank, percentile, attempted/correct questions
    - Time taken, remarks
    - **Real-time validation** — subject scores must sum to total, .5 increments enforced
    - **Live stats** — auto-calculated wrong questions & accuracy
- **Edit Mock** — Pre-filled form with update capability
- **Mock Table** — Sortable, searchable, filterable by platform with:
    - Color-coded accuracy badges (green ≥ 75%, amber ≥ 50%, red < 50%)
    - Edit & delete actions

### 📈 Analytics Dashboard

- **4 Metric Cards**: Total Mocks, Average Score, Best Score, Accuracy
- **Score Trend** — Line chart showing score progression over attempts
- **Accuracy Trend** — Line chart showing accuracy over time
- **Subject Radar** — Radar chart of latest mock's subject breakdown
- **Platform Distribution** — Performance comparison across test platforms

### ⚔️ Compare Performance

- Select any student from the directory to compare
- **Side-by-side stat battles** — 9 categories with win/loss indicators
- **Win counter** — Tracks who leads across categories
- **Score trend comparison** — Dual line chart overlay
- **Accuracy trend comparison** — Dual line chart overlay
- **Subject averages comparison** — Grouped bar chart
- **Skill radar comparison** — Dual radar chart overlay
- **Key insights panel** — Score gap, accuracy gap, best score gap, percentile gap

### 🏆 Leaderboard

- Ranked table of all users sorted by average score
- **Gold/Silver/Bronze** styling for top 3
- Displays: Avg Score, Best Score, Accuracy, Total Mocks
- Click any user to view their detailed profile

### 👤 Student Profile

- **Hero section** with avatar, name, join date, readiness status
- **Stats grid** with all key metrics
- **Goal tracker** with progress visualization
- **Main trend chart** — Score progression over all mocks
- **Subject trend charts** — Per-subject performance over time
- **Platform performance chart** — Average scores by platform
- **Radar chart** — Subject skill visualization
- **Subject average bar chart** — Detailed per-subject averages
- **Recent mocks table** — Latest 5 mocks with key stats

### 📋 Students Directory _(featured but currently disabled in routes)_

- Grid view of all registered students
- Search by name
- Quick stats cards (Mocks, Avg, Best, Accuracy)
- Click to navigate to profile

### 🎨 UI/UX Highlights

- **Dark/Light mode** — Toggle via ThemeContext, persisted in localStorage
- **Responsive design** — Works seamlessly on mobile, tablet, and desktop
- **Animations** — Framer Motion on login page, smooth transitions & hover effects throughout
- **Backdrop blur** — Modern glassmorphism effects
- **Gradient cards** — Color-coded metrics for easy scanning
- **Toast notifications** — Real-time feedback for all actions

### 🔧 Technical Features

- **Real-time Firestore** — Live data sync via `onSnapshot` listeners
- **Protected Routes** — Auth-guarded pages with redirect
- **Streak Calculation** — Consecutive day streaks from mock dates
- **Readiness Assessment** — Based on average score thresholds:
    - ≥ 160: **Exam Ready** 🟢
    - ≥ 140: **Competitive** 🔵
    - ≥ 120: **Improving** 🟠
    - < 120: **Needs Work** 🔴
- **Score Prediction** — Linear regression from last 5 mocks
- **Weighted Platform Ranking** — Decay-based weighting prioritizing recent performance
- **Batch JSON Import** — Firestore batch writes with validation

---

## 🛠️ Tech Stack

| Technology                     | Purpose                              |
| ------------------------------ | ------------------------------------ |
| **React 19**                   | UI framework                         |
| **Vite 8**                     | Build tool & dev server              |
| **Tailwind CSS v4**            | Utility-first styling                |
| **Firebase Auth**              | Google authentication                |
| **Firebase Firestore**         | Real-time NoSQL database             |
| **Recharts**                   | Responsive charts (line, bar, radar) |
| **Chart.js**                   | Additional charts                    |
| **Framer Motion**              | Animations                           |
| **React Router v7**            | Client-side routing                  |
| **React Hot Toast**            | Toast notifications                  |
| **Lucide React / React Icons** | Icon sets                            |
| **jsPDF + html2canvas**        | PDF report generation                |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Authentication & Firestore enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cgl-mocks-analyst.git
cd cgl-mocks-analyst

# Install dependencies
npm install

# Set up environment variables
# Create a .env file in the root directory:
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_KEY=your_firebase_api_key
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Root component with routing
├── main.jsx                 # Entry point with providers
├── index.css                # Tailwind imports
│
├── contexts/
│   ├── AuthContext.jsx       # Firebase authentication context
│   └── ThemeContext.jsx      # Dark/Light mode context
│
├── services/
│   ├── firebase.js          # Firebase initialization
│   ├── mockService.js       # CRUD operations for mocks
│   └── leaderboardService.js # Leaderboard data fetching
│
├── hooks/
│   ├── useDashboardStats.js # Dashboard statistics hook
│   └── useJsonImport.js     # JSON import hook
│
├── layouts/
│   └── MainLayout.jsx       # Sidebar + topbar layout
│
├── pages/
│   ├── Login.jsx            # Login page with spiral animations
│   ├── Dashboard.jsx        # Main dashboard
│   ├── Mocks.jsx            # Mock form & table
│   ├── Analytics.jsx        # Analytics dashboard
│   ├── Reports.jsx          # Compare performance page
│   ├── Leaderboard.jsx      # Student leaderboard
│   ├── Profile.jsx          # User profile page
│   ├── Students.jsx         # Student directory
│   └── subjectWiseComp.jsx  # Subject comparison panel
│
├── components/
│   ├── MockForm.jsx         # Add/Edit mock form
│   ├── MockTable.jsx        # Mocks data table
│   ├── ProtectedRoute.jsx   # Auth guard component
│   │
│   ├── dashboard/           # Dashboard components
│   │   ├── DashboardCard.jsx
│   │   ├── HeroSection.jsx
│   │   ├── PerformanceCharts.jsx
│   │   ├── RecentMocks.jsx
│   │   ├── RecordsTable.jsx
│   │   ├── ReportsSection.jsx
│   │   ├── StatsGrid.jsx
│   │   ├── SubjectAverages.jsx
│   │   └── TargetTracker.jsx
│   │
│   ├── profile/             # Profile page components
│   │   ├── ChartCard.jsx
│   │   ├── constants.js
│   │   ├── CustomTooltip.jsx
│   │   ├── Delta.jsx
│   │   ├── GoalTracker.jsx
│   │   ├── MainTrendChart.jsx
│   │   ├── PlatformPerformanceChart.jsx
│   │   ├── ProfileHero.jsx
│   │   ├── RadarChart.jsx
│   │   ├── RecentMocksTable.jsx
│   │   ├── ScorePill.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatsGrid.jsx
│   │   ├── SubjectAverageChart.jsx
│   │   ├── SubjectTrendChart.jsx
│   │   └── utils.js
│   │
│   └── jsonImport/          # JSON import components
│       ├── JsonImportButton.jsx
│       ├── JsonImportWidget.jsx
│       └── JsonPreviewModal.jsx
│
├── charts/                  # Standalone chart components
│   ├── AccuracyTrend.jsx
│   ├── BarChart.jsx
│   ├── BarChartCard.jsx
│   ├── LineChart.jsx
│   ├── LineChartCard.jsx
│   ├── PlatformChart.jsx
│   ├── ScoreTrend.jsx
│   └── SubjectRadar.jsx
│
└── utils/
    ├── mockHelpers.js       # Mock data utility functions
    ├── leaderboardUtils.js  # Leaderboard calculation utilities
    └── profileAnalytics.js  # Profile analytics utilities
```

---

## 🧮 Key Calculations

### Readiness Score

| Average Score | Status         |
| ------------- | -------------- |
| ≥ 160         | Exam Ready ✅  |
| ≥ 140         | Competitive 💪 |
| ≥ 120         | Improving 📈   |
| < 120         | Needs Work 🔧  |

### Streak Calculation

- Consecutive daily mock attempts are tracked
- Both **current streak** and **all-time best streak** are displayed

### Score Prediction

- Uses linear growth from the last 5 mock attempts
- Projects future score based on recent trend

### Platform Ranking

- Weighted scoring system:
    - **60%** — Recent form (exponential decay weighting)
    - **30%** — Peak performance (best score)
    - **10%** — Stability (overall average)

---

## 🔄 Real-time Data

All mock data is synchronized in real-time using Firebase Firestore's `onSnapshot` listeners. Any changes (add, edit, delete) reflect instantly across all views without page refresh.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Suggest enhancements to analytics or UI

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- Built for the **SSC CGL aspirant community**
- Icons by [Lucide](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- Charts by [Recharts](https://recharts.org/) & [Chart.js](https://www.chartjs.org/)
- UI inspiration from modern dashboard designs
