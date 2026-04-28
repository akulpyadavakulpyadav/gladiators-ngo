# ⚔️ GladiConnect — by Team Gladiators

> _Bridging the Gap for Global Goals_

**GladiConnect** is a professional, role-based web application designed to connect **NGOs**, **Volunteers**, and **Corporate Funders** to collaboratively achieve **UN Sustainable Development Goals 16 (Peace, Justice & Strong Institutions)** and **17 (Partnerships for the Goals)**.

---

## 🏛️ About Team Gladiators

We are **Team Gladiators** from **Vidya Vardhaka College of Engineering**, building technology that drives real-world social impact.

---

## 🚀 Features

### 🔐 Role-Based Access Control (RBAC)
- Three distinct workflows: **NGO**, **Volunteer**, **Company (Funder)**
- Verified onboarding using mock **DigiLocker API** and **OTP verification**
- Session persistence via local storage

### 🏢 NGO Dashboard
- **Impact Profile** — Organization bio, media gallery, social links
- **Volunteer Management** — Track volunteers, hours, and campaigns
- **Offline Event Logger** — Logs data locally and syncs when online (localStorage)
- **Finance Suite** — Expense tracking and transparency reports
- **Collab Hub** — NGO-to-NGO messaging for partnerships

### 🤝 Volunteer Dashboard
- **NGO Directory** — Searchable directory with domain/geography filters
- **Interest Matching** — Connect with NGOs aligned to your interests
- **Impact Dashboard** — Track hours volunteered, badges, and events

### 💼 Corporate Funder Portal
- **Funding Portal** — Transparent fund allocation and progress tracking
- **Due Diligence Viewer** — NGO verification status dashboard
- **CSR Impact Reports** — Generate compliance-ready reports

### 🌐 Global Components
- 👤 **Profile Menu** — Edit Profile / Logout (top-left)
- 📞 **24/7 Helpline** — Always-visible support button
- 🌍 **Multi-Language Toggle** — EN / HI / KN language switching

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Framework    | React 19 + Vite                |
| Routing      | React Router DOM               |
| Styling      | Vanilla CSS (custom design system) |
| Icons        | Lucide React                   |
| State        | React Context API              |
| Offline      | localStorage / IndexedDB-ready |
| Fonts        | Google Fonts (Outfit)          |

---

## 🎨 Design System

| Token         | Value       | Usage               |
| ------------- | ----------- | -------------------- |
| Primary       | `#1A5276`   | Deep Ocean Blue — Trust |
| Secondary     | `#1E8449`   | Forest Green — Growth  |
| Background    | `#F4F7F6`   | Cool Grey — Clean UI   |

- **Glassmorphism** cards with subtle borders
- **Gradient text** headings and buttons
- **Micro-animations** on hover, focus, and page transitions
- Fully **mobile-responsive** layout

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/gladiators-ngo.git
cd gladiators-ngo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── GlobalLayout.jsx       # Navigation bar + layout wrapper
│   └── DigilockerMock.jsx     # Reusable verification component
├── context/
│   ├── AuthContext.jsx         # RBAC authentication state
│   └── LanguageContext.jsx     # Multi-language toggle state
├── pages/
│   ├── LandingPage.jsx        # Role selection landing page
│   ├── ngo/
│   │   ├── NgoOnboarding.jsx  # NGO registration flow
│   │   └── NgoDashboard.jsx   # NGO dashboard (5 tabs)
│   ├── volunteer/
│   │   ├── VolunteerOnboarding.jsx  # Volunteer registration flow
│   │   └── VolunteerDashboard.jsx   # Volunteer dashboard (2 tabs)
│   └── company/
│       ├── CompanyOnboarding.jsx    # Company registration flow
│       └── CompanyDashboard.jsx     # Funder dashboard (3 tabs)
├── App.jsx                    # Router + RBAC + Providers
├── main.jsx                   # Entry point
└── index.css                  # Design system & global styles
```

---

## 📜 SDG Alignment

| SDG | Goal | How GladiConnect Contributes |
| --- | ---- | --------------------------- |
| 16  | Peace, Justice & Strong Institutions | Transparent governance tools, verified NGO profiles, accountability reports |
| 17  | Partnerships for the Goals | NGO-Corporate-Volunteer collaboration hub, joint event hosting, CSR tracking |

---

## 👥 Team Gladiators

Built with ❤️ by **Team Gladiators** — Vidya Vardhaka College of Engineering, Mysuru.

---

> _"Alone we can do so little; together we can do so much."_ — Helen Keller
