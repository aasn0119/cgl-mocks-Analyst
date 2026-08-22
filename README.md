<div align="center">

# 🏆 SSC CGL Mock Test Analytics

### Analyze. Improve. Compete. 🚀

**A comprehensive mock-test tracking & AI-powered analytics platform built for SSC CGL aspirants.**

Track **Tier 1 & Tier 2** preparation, understand your strengths and weaknesses,
monitor progress, compete with fellow aspirants, and connect with study buddies —
all from one place.

<br/>

[![Live App](https://img.shields.io/badge/🌐_Live_App-cgl--mocks--analyst.vercel.app-4F46E5?style=for-the-badge)](https://cgl-mocks-analyst.vercel.app/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

[🚀 Live Demo](https://cgl-mocks-analyst.vercel.app/) •
[📖 Features](#-features) •
[🛠️ Tech Stack](#%EF%B8%8F-tech-stack) •
[⚙️ Installation](#-getting-started) •
[🗺️ Roadmap](#%EF%B8%8F-roadmap)

</div>

---

## 🌟 Overview

**SSC CGL Mock Test Analytics** is a modern web application designed to help
SSC CGL aspirants turn mock-test data into meaningful preparation insights.

Instead of simply recording a score, the platform analyzes performance across
subjects, attempts, platforms, and exam tiers to help answer questions like:

> 🎯 *Where am I improving?*  
> 📉 *Which subject needs the most attention?*  
> 📈 *Am I becoming exam-ready?*  
> 🏆 *How do I compare with other aspirants?*

The application combines **mock analytics, AI-powered insights, competitive
rankings, student profiles, real-time chat, and PWA support** into one platform.

---

## 🌐 Live Application

### 👉 [Click here](https://cgl-mocks-analyst.vercel.app/)

The application is installable as a native-feeling app on supported desktop
and mobile browsers.

Look for the **Install App** button in the navbar or use **Add to Home Screen**
on mobile.

---

# 📸 Screenshots

> 💡 Add your application screenshots here to make the README visually richer.

<div align="center">

| 🏠 Dashboard | 📊 Analytics |
|:---:|:---:|
| *Add screenshot* | *Add screenshot* |

| 🏆 Leaderboard | 💬 Study Buddy Chat |
|:---:|:---:|
| *Add screenshot* | *Add screenshot* |

</div>

---

# ✨ Features

## 🔐 Authentication

Secure authentication powered by Firebase.

- 🔵 Google Sign-In
- 🔒 Secure login/logout flow
- 🔄 Automatic redirect for authenticated users

---

## 🎚️ Tier 1 / Tier 2 System

A single tier switcher changes the **entire application context**.

No separate accounts or duplicated data are required.

| | 🟦 Tier 1 | 🟪 Tier 2 — Paper I |
|---|---:|---:|
| **Total Marks** | 200 | 390 |
| **Quant / Mathematical Abilities** | 50 | 90 |
| **Reasoning / Reasoning & GI** | 50 | 90 |
| **English / English & Comprehension** | 50 | 135 |
| **GK / General Awareness** | 50 | 75 |
| **Target Score** | **160** | **310** |

Switching tiers instantly re-scopes:

`Dashboard` · `Mocks` · `Analytics` · `AI Insights` · `Leaderboard` · `Compare` · `Profile`

to the selected tier's:

- 📊 Data
- 📝 Subjects
- 🎯 Maximum marks
- 🚦 Readiness thresholds
- 📈 Charts and calculations

---

# 🧠 AI-Powered Insights

The platform includes a **rule-based analysis engine** that runs entirely
client-side.

> No external AI API is required for the current insights engine.

It analyzes mock history and generates actionable insights such as:

### 🎯 Priority Focus Subject

Identifies the subject that deserves the most attention by considering:

- Current mastery
- Recent performance
- Performance trend

### 📚 Subject-Specific Study Guidance

Different recommendations are generated depending on whether the student is:

`Building Fundamentals` → `Improving Speed & Accuracy` → `Polishing Mastery`

### 📈 Trend Detection

Each subject is classified as:

- 🟢 Improving
- 🟡 Steady
- 🔴 Declining

### ⚠️ Cross-Cutting Flags

The engine can identify:

- Negative-marking risk
- Low accuracy
- Score inconsistency
- Most-improved subject
- Subjects requiring urgent attention

The entire system is **tier-aware**, automatically adapting subject labels and
maximum marks between Tier 1 and Tier 2.

---

# 📊 Dashboard

The dashboard provides a centralized view of preparation progress.

| Feature | Description |
|---|---|
| 👋 **Hero Section** | Personalized welcome, mock count & readiness status |
| ⏳ **Exam Countdown** | Tier-specific exam date and live countdown |
| 🔥 **Weekly Streak** | Consecutive-week practice streak |
| 🎯 **Target Tracker** | Progress toward tier-specific target score |
| 📌 **Stats Grid** | 9 key performance metrics |
| 📚 **Subject Intelligence** | Average scores, strongest & weakest subjects |
| 📈 **Performance Charts** | Score, accuracy & subject trends |
| 📝 **Recent Mocks** | Recent attempts with compare mode |
| 📋 **Reports** | Weekly/monthly summaries and platform ranking |
| 📥 **JSON Import** | Bulk mock-data import |

### Key Metrics

- Total Mocks
- Best Score
- Average Accuracy
- Improvement %
- Current Streak
- Best Streak
- Readiness
- Predicted Score
- Average Percentile

---

# 📝 Mock Management

A complete mock-test management system.

### ➕ Add Mock

Record:

- Date
- Platform
- Mock ID
- Total score
- Subject scores
- Rank
- Percentile
- Attempted questions
- Correct questions
- Time taken
- Remarks

### ⚡ Real-Time Validation

The form automatically validates:

- Subject scores vs total score
- `.5` score increments
- Tier-specific score limits
- Attempt limits
- Time constraints

### 📊 Automatic Statistics

The system calculates:

- Wrong questions
- Accuracy
- Subject performance
- Tier-aware metrics

### 🗂️ Mock Table

Includes:

- 🔎 Search
- ↕️ Sorting
- 🎛️ Platform filtering
- 🎚️ Active-tier filtering
- ✏️ Edit
- 🗑️ Delete
- 🟢 Accuracy ≥ 75%
- 🟡 Accuracy ≥ 50%
- 🔴 Accuracy < 50%

---

# 📈 Analytics Dashboard

A dedicated performance-analysis workspace.

### Metric Cards

`Total Mocks` · `Average Score` · `Best Score` · `Accuracy`

### Visual Analytics

- 📈 Score Trend
- 🎯 Accuracy Trend
- 🕸️ Subject Radar
- 📊 Platform Distribution

### 🤖 AI Insights Panel

Combines the above performance data with the rule-based insight engine to
produce actionable subject recommendations.

---

# ⚔️ Compare Performance

Compare your performance with any other student.

The comparison is automatically scoped to the **currently selected tier**.

### 📊 Comparison Features

- Side-by-side statistics
- 9-category win/loss comparison
- 🏆 Win counter
- Score trend comparison
- Accuracy trend comparison
- Subject-average comparison
- Skill radar comparison
- Key performance insights

### 🔎 Comparison Insights

The system highlights:

- Score gap
- Accuracy gap
- Best-score gap
- Percentile gap

---

# 🏆 Leaderboard

Compete with fellow aspirants.

### Ranking

Students are ranked according to **average score** within the active tier.

### 🥇 Top Performers

The top three positions receive:

🥇 Gold · 🥈 Silver · 🥉 Bronze

### Performance Information

- Average Score
- Best Score
- Accuracy
- Total Mocks

Clicking a student opens their detailed profile.

---

# 👤 Student Profile

Each student receives a detailed performance profile.

### Profile Overview

- Avatar
- Name
- Join date
- Readiness status
- Current tier

### 📊 Performance

- Key statistics
- Goal tracker
- Overall score trend
- Subject trends
- Platform performance
- Skill radar
- Subject-average chart
- Recent mocks

---

# 💬 Study Buddy Chat

Connect with fellow SSC CGL aspirants through a request-based real-time
messaging system.

### 🤝 Connection Flow

```text
Find Student
     ↓
Send Request
     ↓
Recipient Accepts
     ↓
Conversation Created
     ↓
Real-Time Messaging
````

### 💌 Requests

* Send requests
* Accept requests
* Decline requests
* Retract pending requests

### 💬 Messaging

* Real-time messages
* Day separators
* Smooth send/receive animations
* Message management
* Delete-for-me functionality
* Remove Friend functionality

### 🔔 Live Notifications

The Chat system provides live notification indicators for:

* 🔴 Unseen requests
* 💬 Unread messages
* 👥 New students

The main navbar Chat badge aggregates notifications, while individual tabs
display their own counts.

### 📱 WhatsApp-Style Unread Chats

Unread conversations are visually highlighted with:

* Bold student name
* Bold last message
* Green unread-count badge
* Automatic clearing when the conversation is opened

---

# 📋 Students Directory

> **Currently featured but disabled in routes.**

The directory supports:

* 👥 All registered students
* 🔎 Search by name
* 📊 Mock statistics
* 📈 Average score
* 🏆 Best score
* 🎯 Accuracy
* 👤 Direct profile navigation

---

# 📲 Progressive Web App

The application can behave like an installable native application.

### 📱 Installation

Supported browsers can display an **Install App** button.

Mobile users can also use:

`Add to Home Screen`

### ⚡ Offline App Shell

Static application assets are cached through a service worker.

> Live Firestore data is intentionally not cached, ensuring that scores and
> analytics remain current.

### 🔄 Automatic Updates

A notification prompts users to reload when a newer deployment becomes
available.

---

# 🎨 UI / UX

The application is designed around a modern dashboard aesthetic.

### 🌗 Dark / Light Mode

Theme preference is managed through `ThemeContext` and persisted locally.

### 📱 Responsive

Designed for:

`📱 Mobile` · `📲 Tablet` · `💻 Desktop`

### ✨ Motion Design

Framer Motion is used throughout the application for:

* Login animations
* Chat bubbles
* Chat tabs
* Cards
* Countdown widgets
* Hover effects
* Page transitions

### 🪟 Glassmorphism

Backdrop blur and translucent surfaces create the application's modern
glass-style interface.

### 🌈 Gradient Cards

Color-coded gradients make important metrics easier to scan.

### 🔔 Toast Feedback

Actions provide immediate feedback through toast notifications.

---

# 🔧 Technical Highlights

| Capability           | Implementation                     |
| -------------------- | ---------------------------------- |
| 🔄 Real-Time Data    | Firestore `onSnapshot`             |
| 🔐 Authentication    | Firebase Authentication            |
| 🛡️ Route Protection | Protected Routes                   |
| 🔥 Mock Streaks      | Daily & weekly streak calculations |
| 🎯 Readiness         | Tier-aware thresholds              |
| 📈 Score Prediction  | Linear regression                  |
| 🏆 Ranking           | Weighted platform ranking          |
| 📥 Bulk Import       | Firestore batch writes             |
| 🧠 AI Insights       | Deterministic client-side engine   |
| 📱 PWA               | Service Worker + vite-plugin-pwa   |

---

# 🛠️ Tech Stack

<div align="center">

| Technology                  | Purpose                         |
| --------------------------- | ------------------------------- |
| ⚛️ **React 19**             | Frontend UI                     |
| ⚡ **Vite 8**                | Build tool & development server |
| 🎨 **Tailwind CSS v4**      | Styling                         |
| 🔥 **Firebase Auth**        | Google authentication           |
| 🗄️ **Firebase Firestore**  | Real-time NoSQL database        |
| 📊 **Recharts**             | Responsive charts               |
| 📈 **Chart.js**             | Additional charts               |
| 🎞️ **Framer Motion**       | Animations                      |
| 🧭 **React Router v7**      | Client-side routing             |
| 🔔 **React Hot Toast**      | Notifications                   |
| 🎯 **Lucide / React Icons** | Icons                           |
| 📄 **jsPDF + html2canvas**  | PDF generation                  |
| 📲 **vite-plugin-pwa**      | PWA & service worker            |

</div>

---

# 🚀 Getting Started

## 📋 Prerequisites

Make sure you have:

* **Node.js 18+**
* **npm** or **yarn**
* A Firebase project
* Firebase Authentication enabled
* Firebase Firestore enabled

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/aasn0119/cgl-mocks-Analyst.git

cd cgl-mocks-Analyst
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Firebase

Create a `.env` file in the project root.

```env
VITE_API_KEY=your_firebase_api_key
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```

> ⚠️ Never commit sensitive credentials or private configuration files to
> version control.

---

## 4️⃣ Start Development Server

```bash
npm run dev
```

The application will be available through the local development URL shown by
Vite.

---

## 5️⃣ Build for Production

```bash
npm run build
```

---

# 📁 Project Architecture

```text
src/
│
├── App.jsx
├── main.jsx
├── index.css
│
├── config/
│   └── examPatterns.js
│
├── contexts/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   ├── TierContext.jsx
│   └── ChatContext.jsx
│
├── services/
│   ├── firebase.js
│   ├── mockService.js
│   ├── leaderboardService.js
│   └── chatService.js
│
├── hooks/
│   ├── useDashboardStats.js
│   ├── useJsonImport.js
│   └── useMessages.js
│
├── layouts/
│   └── MainLayout.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Mocks.jsx
│   ├── Analytics.jsx
│   ├── Reports.jsx
│   ├── Leaderboard.jsx
│   ├── Chat.jsx
│   ├── Profile.jsx
│   ├── Students.jsx
│   └── subjectWiseComp.jsx
│
├── components/
│   ├── MockForm.jsx
│   ├── MockTable.jsx
│   ├── ProtectedRoute.jsx
│   ├── InstallPWAButton.jsx
│   ├── PWAUpdatePrompt.jsx
│   │
│   ├── analytics/
│   │   └── AIInsightsPanel.jsx
│   │
│   ├── chat/
│   │   ├── ChatSidebar.jsx
│   │   └── ChatWindow.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardCard.jsx
│   │   ├── ExamCountdownStreak.jsx
│   │   ├── HeroSection.jsx
│   │   ├── PerformanceCharts.jsx
│   │   ├── RecentMocks.jsx
│   │   ├── RecordsTable.jsx
│   │   ├── ReportsSection.jsx
│   │   ├── StatsGrid.jsx
│   │   ├── SubjectAverages.jsx
│   │   └── TargetTracker.jsx
│   │
│   ├── profile/
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
│   └── jsonImport/
│       ├── JsonImportButton.jsx
│       ├── JsonImportWidget.jsx
│       └── JsonPreviewModal.jsx
│
├── charts/
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
    ├── mockHelpers.js
    ├── leaderboardUtils.js
    ├── profileAnalytics.js
    ├── aiInsights.js
    └── streaks.js
```

---

# 🧮 Key Calculations

## 🎯 Readiness Assessment

| Tier 1 Average | Tier 2 Average | Status         |
| -------------: | -------------: | -------------- |
|      **≥ 160** |      **≥ 310** | 🟢 Exam Ready  |
|      **≥ 140** |      **≥ 270** | 🔵 Competitive |
|      **≥ 120** |      **≥ 230** | 🟠 Improving   |
|      **< 120** |      **< 230** | 🔴 Needs Work  |

---

## 🔥 Streak Calculation

The application uses two different streak concepts:

### Dashboard

Tracks consecutive **daily mock attempts**, including:

* Current streak
* All-time best streak

### Exam Countdown Widget

Tracks consecutive **weekly practice streaks**:

* Monday → Sunday
* Current week's mock count
* Longest-ever streak

This provides a more forgiving measurement for realistic mock-taking
schedules.

---

## 📈 Score Prediction

The prediction system:

1. Takes the latest **5 mock attempts**
2. Calculates recent linear growth
3. Projects future performance based on the observed trend

---

## 🏆 Platform Ranking

Ranking uses a weighted scoring model:

| Component              |  Weight |
| ---------------------- | ------: |
| 📈 Recent Form         | **60%** |
| 🏆 Peak Performance    | **30%** |
| 📊 Stability / Average | **10%** |

Recent performance receives higher importance through exponential decay
weighting.

---

## 🧠 AI Priority Score

Each subject starts with:

```text
100 - masteryPercent
```

Then:

```text
+15 → Recent downward trend
-8  → Recent upward trend
```

The subject with the highest resulting score becomes the primary focus
recommendation.

---

# 🔒 Firestore Security

Firestore security rules are used to control access to:

```text
users
mocks
weakAreas
chatRequests
chats
chats/{id}/messages
```

The rules enforce:

* 🔐 Allow-listed user access
* 👤 Owner-only mock modifications
* 💌 Sender-controlled request creation
* ✅ Recipient-controlled request responses
* 🔄 Sender-controlled pending-request retraction
* 💬 Participant-only chat access
* 📨 Participant-only message access

See `firestore.rules` or the Firebase Console → **Rules** tab for the complete
ruleset.

> Whenever a new Firestore collection or field is introduced, remember to
> update the security rules accordingly.

---

# 🔄 Real-Time Architecture

The application uses Firebase Firestore's `onSnapshot` listeners for live
data synchronization.

```text
                    Firebase Firestore
                           │
             ┌─────────────┼─────────────┐
             │             │             │
           Mocks        Requests        Chats
             │             │             │
             └─────────────┼─────────────┘
                           │
                    onSnapshot()
                           │
                           ▼
                    React Application
                           │
                           ▼
                 Instant UI Updates
```

Changes such as:

* Adding a mock
* Sending a request
* Accepting a request
* Sending a message
* Updating chat state
* Switching tiers

are reflected without requiring a page refresh.

---

# 🗺️ Roadmap

### ✅ Completed

* [x] Firebase authentication
* [x] Tier 1 / Tier 2 architecture
* [x] Mock management
* [x] Dashboard analytics
* [x] AI-powered insights
* [x] Performance comparison
* [x] Leaderboard
* [x] Student profiles
* [x] Real-time chat
* [x] Chat request system
* [x] PWA support
* [x] Dark / Light mode
* [x] Responsive UI

### 🚧 In Development / Future Improvements

* [ ] Advanced notification system
* [ ] Further AI-powered insights
* [ ] More competitive analytics
* [ ] Additional student/community features
* [ ] Further chat enhancements

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome!

You can contribute by:

🐛 Opening an issue for bugs
💡 Suggesting new features
🎨 Improving UI/UX
📊 Improving analytics
💬 Enhancing the chat system
🔧 Submitting pull requests

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 🙏 Acknowledgements

Built for the **SSC CGL aspirant community** ❤️

Special thanks to the projects and libraries that make this application
possible:

* [Lucide](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) — Icons
* [Recharts](https://recharts.org/) & [Chart.js](https://www.chartjs.org/) — Charts
* [Framer Motion](https://www.framer.com/motion/) — Animations

---

<div align="center">

## 🚀 SSC CGL Mock Test Analytics

**Prepare smarter. Track better. Improve faster.**

[🌐 Open Live App](https://cgl-mocks-analyst.vercel.app/)

<br/>

⭐ **If this project helps you, consider giving it a star!** ⭐

</div>
```

### Why I prefer this design

The biggest improvement is **visual hierarchy**. Your original README has excellent information, but several sections are essentially long technical lists. For example, the original has a very large Features section covering Dashboard, Mocks, Analytics, Compare, Leaderboard, Profile, Chat, PWA, UI/UX, and technical features consecutively. 

The redesigned version gives each major feature a **visual identity**:

> 🔐 Authentication
> 🎚️ Tier System
> 🧠 AI Insights
> 📊 Dashboard
> 📝 Mock Management
> 📈 Analytics
> ⚔️ Compare
> 🏆 Leaderboard
> 👤 Profile
> 💬 Chat
> 📲 PWA

That makes someone scanning the GitHub page understand the project in **seconds**.

I also deliberately kept the technical material toward the bottom. Your current README has the project structure and calculation details, which are useful, but they're better after the reader understands **what the application actually does**. 

### One thing I'd strongly recommend adding

The **Screenshots section** is currently just a placeholder in your original README. 

For this particular project, screenshots will make a **huge** difference because you've invested heavily in the UI: gradients, glassmorphism, charts, animations, chat, profile, leaderboard, etc.

I'd make the top of the README visually resemble a product landing page:

```text
                 🏆 SSC CGL Mock Test Analytics

                 Analyze. Improve. Compete.

       [ Live Demo ] [ GitHub ] [ Documentation ]

 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │                    DASHBOARD SCREENSHOT                  │
 │                                                          │
 └──────────────────────────────────────────────────────────┘

      📊 Analytics       🏆 Leaderboard       💬 Chat
```

That would make the repository look **far more like a finished software product** rather than just a student project.

Also, I would **not add fake metrics such as "10K+ Users", "99.9% uptime", GitHub stars, downloads, etc.** unless you actually have those numbers. Your existing README is technically detailed enough that it doesn't need artificial marketing claims.
