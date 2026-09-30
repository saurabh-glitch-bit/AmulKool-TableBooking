/**
 * ReservationsPage.jsx — Page 3: My Reservations
 * Features: View all bookings, search/filter, edit inline, delete with confirmation,
 *           empty state, animated list items.
 * Uses: useState, useEffect, Framer Motion (AnimatePresence, layoutId)
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TIME_SLOTS, TASTING_OPTIONS } from '../data/tablesData';

// ── Card list animation ──
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0, transition: { duration: 0.3 } },
};

function ReservationsPage({ reservations, onUpdate, onDelete }) {
  // ── Search & filter state ──
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filtered, setFiltered] = useState(reservations);

  // ── Edit mode state ──
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ── Delete confirmation ──
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // ── Filter reservations ──
  useEffect(() => {
    let result = [...reservations];

    // Search by name, phone, or table name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          (r.tableName && r.tableName.toLowerCase().includes(q)) ||
          r.partyType.toLowerCase().includes(q)
      );
    }

    // Filter by date
    if (filterDate) {
      result = result.filter((r) => r.date === filterDate);
    }

    setFiltered(result);
  }, [reservations, searchQuery, filterDate]);

  // ── Start editing ──
  const startEdit = (reservation) => {
    setEditingId(reservation.id);
    setEditForm({
      name: reservation.name,
      phone: reservation.phone,
      email: reservation.email,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      tasting: reservation.tasting,
      occasion: reservation.occasion || '',
    });
  };

  // ── Save edit ──
  const saveEdit = (id) => {
    // Simple validation
    if (!editForm.name.trim() || !editForm.phone.trim() || !editForm.date) {
      return;
    }
    const tastingObj = TASTING_OPTIONS.find((t) => t.value === editForm.tasting) || TASTING_OPTIONS[0];
    const guests = Number(editForm.guests) || 1;
    const subtotal = guests * (200 + (tastingObj.price || 0));
    const gst = Math.round(subtotal * 0.05);
    const updatedDeposit = subtotal + gst;

    onUpdate(id, {
      ...editForm,
      guests,
      depositAmount: updatedDeposit,
    });
    setEditingId(null);
  };

  // ── Cancel edit ──
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // ── Confirm delete ──
  const confirmDelete = (id) => {
    onDelete(id);
    setDeleteConfirmId(null);
  };

  // ── Calculate stats ──
  const totalGuests = reservations.reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
  const totalDeposits = reservations.reduce((sum, r) => sum + (Number(r.depositAmount) || (Number(r.guests) || 2) * 210), 0);
  const upcomingCount = reservations.filter((r) => {
    const d = new Date(r.date + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return d >= now;
  }).length;

  return (
    <section style={{ padding: '40px 20px 80px', maxWidth: 1280, margin: '0 auto' }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 36 }}
      >
        <span className="section-eyebrow">
          <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>receipt_long</span>
          Booking Management
        </span>
        <h1 className="section-title">My Reservations</h1>
        <p className="section-subtitle">
          View, edit, search, and manage all your table bookings. Your reservations are saved locally.
        </p>
      </motion.div>

      {/* ── Stats Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { icon: 'calendar_month', value: reservations.length, label: 'Total Bookings', color: '#63001E' },
          { icon: 'upcoming', value: upcomingCount, label: 'Upcoming', color: '#059669' },
          { icon: 'group', value: totalGuests, label: 'Total Guests', color: '#00529B' },
          { icon: 'payments', value: `₹${totalDeposits.toLocaleString('en-IN')}`, label: 'Deposits Value', color: '#b45309' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(99,0,30,0.08)',
              borderRadius: 20,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `${stat.color}10`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: '1.5rem' }}>
                {stat.icon}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#837375', fontWeight: 500 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Search & Filter ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 28,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div className="search-bar" style={{ maxWidth: 380 }}>
          <span className="material-symbols-outlined" style={{ color: '#837375', fontSize: '1.2rem' }}>search</span>
          <input
            type="text"
            placeholder="Search by name, phone, table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <input
          type="date"
          className="form-input"
          style={{ maxWidth: 200, padding: '10px 16px', borderRadius: 100 }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="Filter by date"
        />
        {(searchQuery || filterDate) && (
          <button
            className="btn-outline"
            style={{ padding: '10px 20px' }}
            onClick={() => { setSearchQuery(''); setFilterDate(''); }}
          >
            Clear Filters
          </button>
        )}
        <Link to="/book" className="btn-rose" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
          New Booking
        </Link>
      </motion.div>

      {/* ── Reservation Cards ── */}
      {filtered.length > 0 ? (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((reservation) => (
              <motion.div
                key={reservation.id}
                layout
                variants={itemVariants}
                exit="exit"
                className="reservation-card"
              >
                {editingId === reservation.id ? (
                  /* ── EDIT MODE ── */
                  <div>
                    <div style={{
                      fontSize: '0.7rem', fontWeight: 700, color: '#63001E',
                      textTransform: 'uppercase', letterSpacing: 1.5,
                      marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>edit</span>
                      Editing Reservation
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                      <div>
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-input"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Time</label>
                        <select
                          className="form-select"
                          value={editForm.time}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        >
                          {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Guests</label>
                        <input
                          type="number"
                          className="form-input"
                          min="1"
                          max="20"
                          value={editForm.guests}
                          onChange={(e) => setEditForm({ ...editForm, guests: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="form-label">Welcome Drink</label>
                        <select
                          className="form-select"
                          value={editForm.tasting}
                          onChange={(e) => setEditForm({ ...editForm, tasting: e.target.value })}
                        >
                          {TASTING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Occasion</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editForm.occasion}
                          onChange={(e) => setEditForm({ ...editForm, occasion: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <motion.button
                        className="btn-rose"
                        style={{ padding: '10px 24px', fontSize: '0.85rem' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => saveEdit(reservation.id)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>save</span>
                        Save Changes
                      </motion.button>
                      <button className="btn-outline" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── VIEW MODE ── */
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 250 }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 14,
                          background: 'rgba(99,0,30,0.06)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span className="material-symbols-outlined" style={{ color: '#63001E', fontSize: '1.4rem' }}>
                            person
                          </span>
                        </div>
                        <div>
                          <h3 style={{
                            fontFamily: "'EB Garamond', serif", fontSize: '1.2rem',
                            fontWeight: 700, color: '#63001E',
                          }}>
                            {reservation.name}
                          </h3>
                          <span style={{ fontSize: '0.72rem', color: '#837375', fontWeight: 500 }}>
                            ID: {reservation.id.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Details grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: 8,
                        fontSize: '0.82rem',
                        color: '#514345',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#63001E' }}>calendar_month</span>
                          {new Date(reservation.date + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#63001E' }}>schedule</span>
                          {reservation.time}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#63001E' }}>group</span>
                          {reservation.guests} Guest{reservation.guests !== 1 ? 's' : ''}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#63001E' }}>phone</span>
                          {reservation.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#63001E' }}>local_cafe</span>
                          {reservation.tasting}
                        </div>
                        {reservation.tableName && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#63001E' }}>table_restaurant</span>
                            {reservation.tableName}
                          </div>
                        )}
                        {reservation.occasion && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#63001E' }}>celebration</span>
                            {reservation.occasion}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.95rem', color: '#059669' }}>payments</span>
                          <span style={{ fontWeight: 600, color: '#059669' }}>
                            ₹{reservation.depositAmount || ((Number(reservation.guests) || 2) * 210)} Deposit
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <motion.button
                        className="btn-outline"
                        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => startEdit(reservation)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>edit</span>
                        Edit
                      </motion.button>

                      {deleteConfirmId === reservation.id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn-danger"
                            onClick={() => confirmDelete(reservation.id)}
                          >
                            Confirm Delete
                          </button>
                          <button
                            className="btn-outline"
                            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <motion.button
                          className="btn-danger"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setDeleteConfirmId(reservation.id)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>delete</span>
                          Cancel
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* ── Empty State ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state"
        >
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">
            {reservations.length === 0 ? 'No Reservations Yet' : 'No Results Found'}
          </h3>
          <p className="empty-state-text">
            {reservations.length === 0
              ? 'Book your first table at the Amul Kool Rose Lounge to get started!'
              : 'Try adjusting your search or date filter.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <Link to="/book" className="btn-rose" style={{ textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
              Book a Table
            </Link>
            {(searchQuery || filterDate) && (
              <button
                className="btn-outline"
                onClick={() => { setSearchQuery(''); setFilterDate(''); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default ReservationsPage;
