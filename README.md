# 🌹 Amul Kool Rose — Experience & Restaurant Table Booking System

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.x-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> An immersive full-stack web application combining a **high-performance 240-frame canvas scroll animation** landing experience with a **modern ReactJS Restaurant Table Booking & Management SPA**.

---

## 🌟 Overview

This project consists of two seamlessly integrated experiences:

1. **Brand Experience Landing Page (`index.html`)**:
   - Ultra-smooth **240-frame 3D product reveal** driven by user scroll using HTML5 Canvas & DPR-aware cover rendering.
   - Ambient sound immersion powered by the native **Web Audio API** (zero external audio libraries).
   - Gourmet shake menu showcasing 6 handcrafted milkshakes with dynamic quick-order modal and live subtotal calculations.
   - Elegant typography with *EB Garamond*, *Inter*, and *JetBrains Mono*.

2. **Interactive ReactJS Table Booking Application (`booking.html`)**:
   - Built with **React 19**, **Vite**, and **Framer Motion**.
   - **3 Dedicated Functional Views**:
     - 🍽️ **Dining Spaces & Table Directory**: Browse 8 curated dining areas with live search and category filters.
     - 📝 **Interactive Table Booking Form**: Multi-step reservation flow with client-side validation, party size selector, and real-time deposit/bill calculation breakdown.
     - 📋 **Reservation Management Dashboard (CRUD)**: View, search, filter by date, inline-edit reservations with auto-recalculation, and cancel with safety confirmation.
   - **Persistent Storage**: All reservations are saved in `localStorage` with preloaded sample data for immediate evaluation.

---

## 📋 Academic Rubric & Features Checklist

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Preserve Existing Webpage** | The original HTML5, CSS3, and JavaScript landing experience is 100% intact, linked seamlessly via responsive desktop & mobile navigation. | ✅ Complete |
| **React Components & JSX** | Modular components (`App.jsx`, `TablesPage.jsx`, `BookingPage.jsx`, `ReservationsPage.jsx`) written in modern JSX. | ✅ Complete |
| **State & Lifecycle Hooks** | Extensive use of `useState` and `useEffect` across all views for reactive filters, search, touched-field validation, and localStorage persistence. | ✅ Complete |
| **Form Handling & Client-Side Validation** | Comprehensive form with real-time error messaging on blur and submission for Name (letters only), Phone (10–13 digits), Email (RFC regex), Date (past date prevention), and Guests (1–20). | ✅ Complete |
| **Interactive Features (Add, Edit, Delete, Search, Filter, Calculate)** | - **Add**: Submit new reservations into global state & storage.<br>- **Edit**: Inline editing of reservation details with save/cancel.<br>- **Delete**: Cancel booking with confirmation safety modal.<br>- **Search**: Real-time multi-field search across tables and bookings.<br>- **Filter**: Category filter chips on tables; date picker filter on bookings.<br>- **Calculate**: Real-time deposit calculation (Cover + Tasting + 5% GST) and live dashboard KPI totals. | ✅ Complete |
| **Three Functional Views** | 1. `TablesPage.jsx` (`/`)<br>2. `BookingPage.jsx` (`/book`, `/book/:tableId`)<br>3. `ReservationsPage.jsx` (`/reservations`) | ✅ Complete |
| **Animations & Aesthetics** | Polished micro-interactions, page transitions, and modal entry/exit powered by **Framer Motion** (`AnimatePresence`). | ✅ Complete |

---

## 🗂️ Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── ezgif-79682e0a1532d24d-jpg/ # 240 High-Definition animation frames
│   ├── ezgif-frame-001.jpg
│   └── ... (frames 002-240)
├── src/
│   ├── data/
│   │   └── tablesData.js       # Table definitions, pricing, & sample reservations
│   ├── pages/
│   │   ├── TablesPage.jsx      # View 1: Tables showcase with search & filters
│   │   ├── BookingPage.jsx     # View 2: Booking form, live calculation & confirmation
│   │   └── ReservationsPage.jsx# View 3: Dashboard, stats, search, edit & delete
│   ├── App.jsx                 # Root React component, routing & global state
│   ├── main.jsx                # React DOM entry point with HashRouter
│   └── index.css               # Design system & component CSS variables
├── app.js                      # Canvas scroll animation & landing page logic
├── booking.html                # HTML entry point for the React Booking SPA
├── index.html                  # HTML entry point for the main landing page
├── style.css                   # Custom styles for the landing experience
├── vite.config.js              # Multi-page Vite configuration with relative base
├── package.json                # Project dependencies and npm scripts
└── .gitignore                  # Git exclusions for dependencies and build files
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone or Navigate to Project
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd "Case Study WEBPAGE"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

The application will be live at:
- **Main Landing Page**: [http://localhost:3000/](http://localhost:3000/)
- **React Table Booking App**: [http://localhost:3000/booking.html](http://localhost:3000/booking.html)

### 4. Build for Production
```bash
npm run build
```
The production bundle will be generated in the `dist/` directory.

---

## 🐙 How to Create a New GitHub Repository

Follow these steps to upload this project to your GitHub account:

### Step 1: Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. In the top-right corner, click **`+`** → **New repository**.
3. Set a repository name (e.g. `AmulKool-TableBooking`).
4. Choose **Public**.
5. **Do NOT** initialize with a README, .gitignore, or license (we already have them).
6. Click **Create repository**.
7. Copy the repository HTTPS URL (e.g. `https://github.com/<your-username>/AmulKool-TableBooking.git`).

### Step 2: Initialize & Push from Your Terminal
Open PowerShell or your terminal in this project folder and run:

```bash
# 1. Stage all project files
git add .

# 2. Commit the changes
git commit -m "feat: complete interactive React table booking system and 3D landing page"

# 3. Rename branch to main (if not already)
git branch -M main

# 4. Point to your new GitHub repository URL:
# (If creating a brand new repo, remove existing origin and set new)
git remote set-url origin https://github.com/<your-username>/<your-repo-name>.git

# 5. Push your code to GitHub
git push -u origin main
```

---

## 🌐 How to Deploy on GitHub Pages

### Method 1: Automated Deployment with GitHub Actions (Recommended)

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Go to your repository on GitHub.
2. Click **Settings** (tab at the top).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** → **Source**, select **`GitHub Actions`**.
5. That's it! Every time you push to the `main` branch, GitHub Actions will automatically:
   - Install dependencies with `npm ci`
   - Build the project with `npm run build`
   - Deploy the `dist/` directory to GitHub Pages.
6. Your live website URL will be displayed under the **Pages** section:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

### Method 2: One-Command Deployment with `gh-pages`

If you prefer deploying directly from your terminal:

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add a deploy script to `package.json`:
   ```json
   "scripts": {
     "dev": "vite --port 3000 --host",
     "build": "vite build",
     "preview": "vite preview",
     "deploy": "vite build && gh-pages -d dist"
   }
   ```
3. Run:
   ```bash
   npm run deploy
   ```
4. In GitHub repository **Settings** → **Pages**, set Source to **Deploy from a branch** and select branch `gh-pages` / `/ (root)`.

---

## 💡 Key Highlights for Evaluators

1. **Dual Architectural Approach**: High-fidelity landing page for branding + rich React SPA for business logic.
2. **Defensive Image Handling**: Every card has automated fallback handlers to prevent broken image cards.
3. **Transparent Financial Calculations**: Clear formulaic calculations including table covers, tasting upgrades, and tax estimation.
4. **Accessible & Responsive**: Fully responsive grid layouts tested on desktop, tablet, and mobile screens.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
