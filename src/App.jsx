/**
 * App.jsx — Root Application Component
 * Routes between the 3 functional views:
 *   1. TablesPage — Display restaurant tables with search/filter
 *   2. BookingPage — Booking form with validation
 *   3. ReservationsPage — View, edit, delete, search reservations
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TablesPage from './pages/TablesPage';
import BookingPage from './pages/BookingPage';
import ReservationsPage from './pages/ReservationsPage';
import { INITIAL_RESERVATIONS } from './data/tablesData';

// ── Page transition animation config ──
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

function App() {
  const location = useLocation();

  // ── Global Reservations State (shared across pages) ──
  const [reservations, setReservations] = useState(() => {
    try {
      const stored = localStorage.getItem('amulkool_reservations');
      return stored ? JSON.parse(stored) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  // ── Toast notifications ──
  const [toast, setToast] = useState(null);

  // Persist reservations to localStorage
  useEffect(() => {
    localStorage.setItem('amulkool_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addReservation = (reservation) => {
    const newRes = {
      ...reservation,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newRes, ...prev]);
    setToast('🎉 Reservation confirmed successfully!');
    return newRes;
  };

  const updateReservation = (id, updates) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    setToast('✅ Reservation updated successfully!');
  };

  const deleteReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    setToast('🗑️ Reservation cancelled.');
  };

  // ── Mobile menu state ──
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ── Navigation Bar ── */}
      <header className="booking-nav">
        <div className="booking-nav-inner">
          {/* Brand */}
          <Link to="/" className="nav-brand">
            <span className="nav-brand-badge">Amul</span>
            <span className="nav-brand-text">
              KOOL<span className="nav-brand-dot">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-menu">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-menu-link ${isActive ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: 4 }}>table_restaurant</span>
                Tables
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/book"
                className={({ isActive }) => `nav-menu-link ${isActive ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: 4 }}>edit_calendar</span>
                Book Now
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reservations"
                className={({ isActive }) => `nav-menu-link ${isActive ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: 4 }}>receipt_long</span>
                My Reservations
                {reservations.length > 0 && (
                  <span style={{
                    marginLeft: 6,
                    background: '#63001E',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 100,
                    minWidth: 20,
                    textAlign: 'center',
                    display: 'inline-block',
                  }}>
                    {reservations.length}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <a href="index.html" className="nav-back-link">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
                Back to Main Site
              </a>
            </li>
          </ul>

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <NavLink to="/" end className={({ isActive }) => `nav-menu-link ${isActive ? 'active' : ''}`} style={{ display: 'block' }}>
                  Tables
                </NavLink>
                <NavLink to="/book" className={({ isActive }) => `nav-menu-link ${isActive ? 'active' : ''}`} style={{ display: 'block' }}>
                  Book Now
                </NavLink>
                <NavLink to="/reservations" className={({ isActive }) => `nav-menu-link ${isActive ? 'active' : ''}`} style={{ display: 'block' }}>
                  My Reservations ({reservations.length})
                </NavLink>
                <a href="index.html" className="nav-back-link" style={{ width: 'fit-content' }}>
                  ← Back to Main Site
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page Routes ── */}
      <main className="page-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <TablesPage />
                </motion.div>
              }
            />
            <Route
              path="/book"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <BookingPage onAddReservation={addReservation} />
                </motion.div>
              }
            />
            <Route
              path="/book/:tableId"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <BookingPage onAddReservation={addReservation} />
                </motion.div>
              }
            />
            <Route
              path="/reservations"
              element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <ReservationsPage
                    reservations={reservations}
                    onUpdate={updateReservation}
                    onDelete={deleteReservation}
                  />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="booking-footer">
        <div className="booking-footer-inner">
          <span className="booking-footer-brand">AMUL KOOL Rose</span>
          <span className="booking-footer-text">
            © 2026 Amul Kool Rose • Restaurant Table Booking System • Built with React
          </span>
        </div>
      </footer>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="booking-toast"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
