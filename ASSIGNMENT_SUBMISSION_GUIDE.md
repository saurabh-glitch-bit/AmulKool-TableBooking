# 🎓 FULL STACK WEB DEVELOPMENT — ASSIGNMENT SUBMISSION REPORT & PPT DECK

---

## 📌 Project Overview & Metadata

- **Project Title:** Amul Kool Rose — Immersive Experience & Restaurant Table Reservation System
- **Course:** Full Stack Web Development (5th Semester)
- **Repository:** [https://github.com/saurabh-glitch-bit/AmulKool-TableBooking](https://github.com/saurabh-glitch-bit/AmulKool-TableBooking)
- **Live Landing Page:** [https://saurabh-glitch-bit.github.io/AmulKool-TableBooking/](https://saurabh-glitch-bit.github.io/AmulKool-TableBooking/)
- **Live React Reservation SPA:** [https://saurabh-glitch-bit.github.io/AmulKool-TableBooking/booking.html](https://saurabh-glitch-bit.github.io/AmulKool-TableBooking/booking.html)
- **Core Technologies:** HTML5, CSS3, ES6 JavaScript, React 19, Lucide React, Canvas API, Web Audio API, LocalStorage API, Vite, GitHub Actions CI/CD.

---

## 🔄 Short Explanation of Application Workflow

The application operates as a **two-tier modern web experience**:

```
[ Tier 1: Brand Experience & Showcase ] (index.html)
       │
       ├── 1. Initial 3D Canvas / Video Reveal Animation (240 frames scrubbed via Canvas)
       ├── 2. Interactive Audio Experience (Web Audio API synthesizers)
       ├── 3. Dynamic Beverage Showcase & Specification Modal
       └── 4. Seamless Navigation CTA -> Redirects to Table Booking App
       │
       ▼
[ Tier 2: React 19 Table Booking SPA ] (booking.html)
       │
       ├── View 1: Tables Directory (`/`)
       │     ├── Real-time Search by Name, Location, or Tag
       │     ├── Category Filter Chips (All, Intimate, Lounge, VIP, Bar, Family)
       │     └── Direct Table Selection -> Passes Table ID to Reservation Form
       │
       ├── View 2: Instant Reservation Form (`/book`)
       │     ├── Dynamic Seating & Party Size Selection (2 to 6+ guests)
       │     ├── Real-time Date Picker (Restricted against past dates) & Time Slot selector
       │     ├── Complimentary Welcome Drink Add-ons (Rose Tasting, Kesar Treat, Elaichi Mist)
       │     ├── Guest Info Validation (Regex phone validation, valid email structure)
       │     ├── ⚡ Live Bill & Deposit Calculator:
       │     │     [Cover Charge (₹200/guest) + Welcome Add-on] + 5% GST = Total Deposit
       │     └── Submit Reservation -> Persisted to LocalStorage + Confirmation Toast
       │
       └── View 3: Reservation Management (`/my-reservations`)
             ├── KPI Stat Badges (Total, Confirmed, Waitlist)
             ├── Filter by Status / Search Bookings
             ├── Inline Modification (Guest count, date, time)
             └── Cancellation Handler with Confirmation Modal
```

---

## 🖥️ Presentation Slides (PPT Deck Content with Screenshot Integration)

Below is the complete slide-by-slide structure designed for PowerPoint / Google Slides, including talking points, slide visuals, and screenshot placements.

---

### **Slide 1: Title Slide**
- **Title:** Amul Kool Rose — Immersive Experience & Restaurant Table Reservation System
- **Subtitle:** Full Stack Web Development Academic Assignment
- **Student Name:** Saurabh Sharma
- **Semester / Subject:** 5th Semester — Full Stack Development
- **Live Demo Link:** `https://saurabh-glitch-bit.github.io/AmulKool-TableBooking/`
- **GitHub Repository:** `https://github.com/saurabh-glitch-bit/AmulKool-TableBooking`

---

### **Slide 2: Problem Statement & Objectives**
- **The Challenge:**
  - Modern hospitality and beverage brands require more than static landing pages; they need high-engagement brand storytelling coupled with friction-free dining reservation systems.
  - Traditional booking forms lack real-time pricing transparency, causing high drop-off rates during checkout.
- **Objectives:**
  1. Build a high-performance, responsive web application combining rich multimedia storytelling with a dedicated Single Page Application (SPA).
  2. Implement real-time mathematical calculations for cover charges, upgrades, and tax (GST).
  3. Ensure robust client-side validation and full CRUD (Create, Read, Update, Delete) capability using modern browser storage.
  4. Implement automated CI/CD deployment using GitHub Pages.

---

### **Slide 3: Technology Stack & Technical Architecture**

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend Foundation** | HTML5, CSS3, ES6+ JavaScript | Semantic layout, CSS variables, mobile responsiveness |
| **Animation & Media** | HTML5 2D Canvas, Web Audio API | Frame-by-frame 240p bottle rotation, ambient sound synthesizers |
| **SPA Framework** | React 19, React Router (HashRouter) | Component-driven UI, state management, client-side routing |
| **Icons & Styling** | Lucide React, Custom CSS Tokens | Luxury Rose & Burgundy color palette, interactive micro-states |
| **State & Storage** | React `useState`, `useEffect`, `localStorage` | Real-time bill recalculation and offline persistence |
| **Build & CI/CD** | Vite 6, GitHub Actions | Multi-entry bundling (`index.html` + `booking.html`) & zero-touch deployment |

---

### **Slide 4: Feature 1 — Immersive 3D Experience (Landing Page)**
*(Attach Screenshot 1 here: Hero section with Amul Kool 3D bottle)*

- **Key Highlights:**
  - **Cinematic Product Reveal:** 240-frame sequence rendered onto an HTML5 Canvas synced with page interaction.
  - **Dynamic Audio:** Interactive sound toggle utilizing the Web Audio API with zero external audio assets required.
  - **Clear Call-to-Actions:** "Explore Menu" opens an in-page modal; "Book Table" routes directly to the React reservation engine.
- **Viva / Speaking Point:** *"The landing page showcases advanced front-end performance techniques like asset preloading, requestAnimationFrame rendering, and graceful fallbacks."*

---

### **Slide 5: Feature 2 — Dining Spaces Showcase & Dynamic Filters**
*(Attach Screenshot 3 here: Choose Your Perfect Table gallery)*

- **Key Highlights:**
  - **Smart Search:** Instant real-time filtering across table names, locations (e.g., Indoor, Terrace, Window Side), and features.
  - **Category Chips:** Instant filter switching between `All`, `Intimate`, `Lounge`, `VIP`, `Bar`, and `Family`.
  - **Responsive Cards:** Visual seating capacity, price brackets, tag badges, and availability status.
  - **Direct Booking Link:** Clicking any table automatically prefills the party size and table name in the booking form.
- **Viva / Speaking Point:** *"Filtering is implemented in React using declarative array operations (`filter`, `toLowerCase`, `includes`) coupled with reactive state hooks."*

---

### **Slide 6: Feature 3 — Instant Reservation Form & Live Bill Calculator**
*(Attach Screenshot 2 here: Instant Reservation Form with Live Bill Breakdown)*

- **Key Highlights:**
  - **Multi-Step Form in Single View:** Seating selection, date picker, time slot, welcome flight upgrades, and contact inputs.
  - **Real-Time Financial Calculation Widget:**
    - Table Cover Charge: $\text{Guests} \times ₹200$
    - Welcome Add-on Charge: Complimentary (₹0) or Upgrade (₹100/guest or ₹80/guest)
    - Subtotal = Cover Charge + Upgrade
    - Tax = 5% GST on Subtotal
    - Total Reservation Deposit = $\text{Subtotal} + \text{GST}$ (Updates automatically as options change).
  - **Client-Side Form Validation:**
    - Checks for non-empty guest names.
    - Validates 10-digit phone numbers via RegEx.
    - Validates standard email patterns.
    - Restricts booking dates to current or future dates only.
- **Viva / Speaking Point:** *"The real-time calculation widget eliminates checkout surprises by recalculating deposits instantly using React's reactive state loop without submitting or reloading."*

---

### **Slide 7: Feature 4 — Reservation Management & Full CRUD Operations**
- **Dashboard Functionality:**
  - **Create:** Bookings created in `/book` are instantly written to `localStorage`.
  - **Read:** The "My Reservations" tab lists all booked tables with date, time, party size, and total deposit.
  - **Update:** Users can edit party size, date, or time slot directly from the reservations screen.
  - **Delete:** Built-in cancellation action with a safety confirmation prompt.
- **KPI Metrics Header:**
  - Dynamically calculates Total Bookings, Active Tables, and Total Deposit Collected.

---

### **Slide 8: Deployment & CI/CD Pipeline**
- **Multi-Page Application Architecture:**
  - Built with Vite supporting two HTML entry points: `index.html` (Landing) and `booking.html` (SPA).
  - Configured `vite.config.js` with `base: './'` for seamless relative asset resolution on GitHub Pages.
- **GitHub Actions Automated Pipeline (`.github/workflows/deploy.yml`):**
  - Triggers automatically on push to branch `main`.
  - Runs clean dependency installation with `npm ci`.
  - Executes production bundle with `npm run build`.
  - Deploys static artifacts directly to GitHub Pages with automatic permission configuration.

---

### **Slide 9: Learning Outcomes & Conclusion**
- **Full Stack Concepts Demonstrated:**
  1. Separation of concerns between marketing landing page and transactional SPA.
  2. Clean state management using React hooks (`useState`, `useEffect`, `useMemo`).
  3. Client-side input validation and error prevention.
  4. Real-time dynamic business calculations.
  5. Cross-session data persistence using the Web Storage API.
  6. Industry-standard version control and CI/CD automation.

---

## 📋 Copy-Ready Summary Table for Assignment Submission Form

| Field | Content to Copy & Submit |
| :--- | :--- |
| **Project Name** | Amul Kool Rose — Experience & Restaurant Table Booking System |
| **GitHub Repo** | `https://github.com/saurabh-glitch-bit/AmulKool-TableBooking` |
| **Live URL (Landing)** | `https://saurabh-glitch-bit.github.io/AmulKool-TableBooking/` |
| **Live URL (Booking)** | `https://saurabh-glitch-bit.github.io/AmulKool-TableBooking/booking.html` |
| **Front-End Stack** | React 19, JavaScript ES6+, HTML5 Canvas, CSS3, Lucide React |
| **Build & Deploy** | Vite 6, GitHub Pages, GitHub Actions CI/CD |
| **Data Storage** | Browser LocalStorage (Persistence for Bookings & State) |
| **Key Features** | 3D Canvas Bottle Reveal, Table Directory with Category Filters, Instant Reservation Form with RegEx Validation, Real-Time Deposit & 5% GST Bill Calculator, Full CRUD Booking Management. |
