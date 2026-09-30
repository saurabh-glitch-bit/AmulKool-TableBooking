/**
 * BookingPage.jsx — Page 2: Restaurant Table Booking Form
 * Features: Multi-step form with client-side validation, party size selection,
 *           date/time pickers, tasting add-on, live booking preview,
 *           and animated confirmation modal.
 * Uses: useState, useEffect, useParams, Framer Motion
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TABLES_DATA, { TIME_SLOTS, TASTING_OPTIONS } from '../data/tablesData';

// ── Validation helpers ──
const validators = {
  name: (val) => {
    if (!val.trim()) return 'Full name is required';
    if (val.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s.'-]+$/.test(val.trim())) return 'Name can only contain letters';
    return '';
  },
  email: (val) => {
    if (!val.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Please enter a valid email';
    return '';
  },
  phone: (val) => {
    if (!val.trim()) return 'Phone number is required';
    const cleaned = val.replace(/[\s\-()]/g, '');
    if (!/^\+?\d{10,13}$/.test(cleaned)) return 'Please enter a valid 10+ digit phone number';
    return '';
  },
  date: (val) => {
    if (!val) return 'Reservation date is required';
    const selected = new Date(val + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) return 'Date cannot be in the past';
    return '';
  },
  guests: (val) => {
    if (!val || val < 1) return 'At least 1 guest is required';
    if (val > 20) return 'Maximum 20 guests per booking';
    return '';
  },
};

// ── Party size options ──
const PARTY_OPTIONS = [
  { size: 2, label: '2 Guests', icon: 'person', type: 'Intimate Table' },
  { size: 4, label: '4 Guests', icon: 'group', type: 'Lounge Booth' },
  { size: 6, label: '6+ Guests', icon: 'groups', type: 'VIP Parlor' },
  { size: 1, label: 'Tasting Bar', icon: 'wine_bar', type: 'Chef Counter' },
];

function BookingPage({ onAddReservation }) {
  const { tableId } = useParams();
  const navigate = useNavigate();

  // ── Find pre-selected table (if navigated from TablesPage) ──
  const preselectedTable = tableId ? TABLES_DATA.find((t) => t.id === tableId) : null;

  // ── Form state ──
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '07:00 PM',
    guests: preselectedTable ? preselectedTable.capacity : 2,
    partyType: preselectedTable ? preselectedTable.type : 'Intimate Table',
    tasting: 'Classic Rose Flight',
    tableName: preselectedTable ? preselectedTable.name : '',
    tableId: preselectedTable ? preselectedTable.id : '',
    occasion: '',
  });

  // ── Errors state ──
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ── Confirmation modal ──
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // ── Set default date to tomorrow ──
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, date: dateStr }));
  }, []);

  // ── Live validation on touched fields ──
  useEffect(() => {
    const newErrors = {};
    if (touched.name) newErrors.name = validators.name(form.name);
    if (touched.email) newErrors.email = validators.email(form.email);
    if (touched.phone) newErrors.phone = validators.phone(form.phone);
    if (touched.date) newErrors.date = validators.date(form.date);
    if (touched.guests) newErrors.guests = validators.guests(form.guests);
    setErrors(newErrors);
  }, [form, touched]);

  // ── Handle field change ──
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ── Handle blur ──
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ── Party size selection ──
  const selectParty = (option) => {
    setForm((prev) => ({
      ...prev,
      guests: option.size,
      partyType: option.type,
    }));
  };

  // ── Tasting selection ──
  const selectTasting = (value) => {
    setForm((prev) => ({ ...prev, tasting: value }));
  };

  // ── Full validation on submit ──
  const validateAll = () => {
    const allErrors = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      phone: validators.phone(form.phone),
      date: validators.date(form.date),
      guests: validators.guests(form.guests),
    };
    setErrors(allErrors);
    setTouched({ name: true, email: true, phone: true, date: true, guests: true });
    return !Object.values(allErrors).some((e) => e);
  };

  // ── Financial / Pricing Calculations ──
  const selectedTastingObj = TASTING_OPTIONS.find((t) => t.value === form.tasting) || TASTING_OPTIONS[0];
  const coverPerGuest = 200; // Base table reservation fee ₹200/guest
  const tastingPerGuest = selectedTastingObj.price || 0;
  const numGuests = Number(form.guests) || 1;
  const coverTotal = numGuests * coverPerGuest;
  const tastingTotal = numGuests * tastingPerGuest;
  const subtotal = coverTotal + tastingTotal;
  const gstAmount = Math.round(subtotal * 0.05); // 5% GST
  const totalDeposit = subtotal + gstAmount;

  // ── Form submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const booking = onAddReservation({
      ...form,
      guests: Number(form.guests),
      coverTotal,
      tastingTotal,
      depositAmount: totalDeposit,
    });

    setConfirmedBooking(booking);
    setShowConfirmation(true);
  };

  // ── Compute preview text ──
  const previewText = (() => {
    const guestText = form.guests === 1 ? 'Tasting Bar Counter' : `${form.guests} Guests (${form.partyType})`;
    const dateFormatted = form.date
      ? new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          weekday: 'short',
        })
      : 'Tomorrow';
    return `${guestText} • ${dateFormatted} at ${form.time} • ${form.tasting} • Deposit ₹${totalDeposit}`;
  })();

  // Today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <section style={{ padding: '40px 20px 80px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* ── Left Column: Info & Table Preview ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ flex: '1 1 380px', minWidth: 300 }}
        >
          <span className="section-eyebrow">
            <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>edit_calendar</span>
            Table Reservation
          </span>
          <h1 className="section-title">
            Book Your Table
            {preselectedTable && (
              <span style={{ display: 'block', fontSize: '0.6em', color: '#00529B', fontStyle: 'italic', marginTop: 4 }}>
                at {preselectedTable.name}
              </span>
            )}
          </h1>
          <p className="section-subtitle">
            Fill in your details below to secure your dining experience at the Amul Kool Rose Lounge.
          </p>

          {/* Pre-selected Table Card */}
          {preselectedTable && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                marginTop: 32,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(99,0,30,0.1)',
                boxShadow: '0 8px 28px rgba(99,0,30,0.06)',
              }}
            >
              <img
                src={preselectedTable.image}
                alt={preselectedTable.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';
                }}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: 20 }}>
                <h3 style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.3rem', color: '#63001E', fontWeight: 700, marginBottom: 6 }}>
                  {preselectedTable.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#514345', lineHeight: 1.6, marginBottom: 8 }}>
                  {preselectedTable.description}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {preselectedTable.features.map((f) => (
                    <span key={f} style={{
                      fontSize: '0.68rem', fontWeight: 600, background: 'rgba(255,183,197,0.2)',
                      color: '#63001E', padding: '3px 10px', borderRadius: 100,
                      border: '1px solid rgba(99,0,30,0.1)',
                    }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Cards */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'room_service', title: "Chef's Signature Flight", desc: 'Live cold-poured rose milk pairings with pistachio crisps' },
              { icon: 'schedule', title: 'Operating Hours', desc: 'Mon–Sun: 11:30 AM to 11:30 PM' },
              { icon: 'local_parking', title: 'Valet & Location', desc: 'Amul Dairy Road, Anand, Gujarat • Free Valet' },
            ].map((info) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: 16,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(99,0,30,0.08)',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#63001E', fontSize: '1.5rem', marginTop: 2 }}>
                  {info.icon}
                </span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#63001E', marginBottom: 2 }}>{info.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#514345' }}>{info.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right Column: Booking Form ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ flex: '1 1 520px', minWidth: 320 }}
        >
          <div className="booking-form-card">
            {/* Form Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              borderBottom: '1px solid rgba(99,0,30,0.08)', paddingBottom: 20, marginBottom: 28,
            }}>
              <div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 600,
                  letterSpacing: '1.5px', textTransform: 'uppercase', color: '#63001E',
                }}>
                  TABLE BOOKING
                </span>
                <h2 style={{
                  fontFamily: "'EB Garamond', serif", fontSize: '1.8rem', fontWeight: 700,
                  color: '#63001E', marginTop: 4,
                }}>
                  Instant Reservation
                </h2>
              </div>
              <span className="material-symbols-outlined" style={{ color: 'rgba(99,0,30,0.3)', fontSize: '2.5rem' }}>
                table_bar
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Party Size */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label">1. Select Party Size & Seating</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {PARTY_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.size}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => selectParty(opt)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '14px 10px', borderRadius: 16, cursor: 'pointer',
                        border: form.guests === opt.size
                          ? '1.5px solid #63001E'
                          : '1.5px solid rgba(99,0,30,0.12)',
                        background: form.guests === opt.size
                          ? '#63001E'
                          : 'rgba(253,249,243,0.7)',
                        color: form.guests === opt.size ? '#FDF9F3' : '#63001E',
                        boxShadow: form.guests === opt.size ? '0 4px 15px rgba(99,0,30,0.2)' : 'none',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem', marginTop: 4 }}>{opt.label}</span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.75 }}>{opt.type}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div>
                  <label className="form-label" htmlFor="booking-date">2. Reservation Date</label>
                  <input
                    type="date"
                    id="booking-date"
                    className={`form-input ${errors.date ? 'error' : ''}`}
                    value={form.date}
                    min={today}
                    onChange={(e) => handleChange('date', e.target.value)}
                    onBlur={() => handleBlur('date')}
                    required
                  />
                  {errors.date && <p className="form-error">{errors.date}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="booking-time">3. Time Slot</label>
                  <select
                    id="booking-time"
                    className="form-select"
                    value={form.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: Tasting Add-on */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label">4. Complimentary Welcome Add-on</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {TASTING_OPTIONS.map((opt) => (
                    <motion.div
                      key={opt.value}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => selectTasting(opt.value)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '14px 8px', borderRadius: 16, cursor: 'pointer',
                        border: form.tasting === opt.value
                          ? '1.5px solid #63001E'
                          : '1.5px solid rgba(99,0,30,0.12)',
                        background: form.tasting === opt.value
                          ? 'rgba(255,183,197,0.3)'
                          : 'rgba(253,249,243,0.7)',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: '#63001E', fontSize: '1.3rem', marginBottom: 4 }}>
                        {opt.icon}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.72rem', color: '#63001E' }}>{opt.label}</span>
                      <span style={{ fontSize: '0.65rem', color: '#514345' }}>{opt.desc}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Step 4: Guest Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label className="form-label" htmlFor="guest-name">Guest Full Name</label>
                  <input
                    type="text"
                    id="guest-name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Saurabh Sharma"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    required
                  />
                  {errors.name && <p className="form-error">{errors.name}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="guest-phone">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    id="guest-phone"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    required
                  />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="guest-email">Email Address</label>
                <input
                  type="email"
                  id="guest-email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div style={{ marginBottom: 28 }}>
                <label className="form-label" htmlFor="guest-occasion">Special Occasion or Note (Optional)</label>
                <input
                  type="text"
                  id="guest-occasion"
                  className="form-input"
                  placeholder="e.g. Anniversary, birthday, window booth..."
                  value={form.occasion}
                  onChange={(e) => handleChange('occasion', e.target.value)}
                />
              </div>

              {/* Step 5: Live Bill & Deposit Calculation */}
              <div style={{
                marginBottom: 24,
                padding: '18px 20px',
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1.5px solid rgba(99, 0, 30, 0.1)',
                boxShadow: '0 4px 16px rgba(99, 0, 30, 0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#63001E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>calculate</span>
                    Live Bill & Deposit Calculation
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>
                    Real-time
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem', color: '#514345' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Table Cover Charge ({numGuests} guest{numGuests !== 1 ? 's' : ''} × ₹{coverPerGuest})</span>
                    <span style={{ fontWeight: 600 }}>₹{coverTotal}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      Welcome Drink ({selectedTastingObj.label}
                      {tastingPerGuest > 0 ? ` @ ₹${tastingPerGuest}/guest` : ' - Complimentary'}
                      )
                    </span>
                    <span style={{ fontWeight: 600, color: tastingTotal > 0 ? '#63001E' : '#059669' }}>
                      {tastingTotal > 0 ? `₹${tastingTotal}` : 'FREE'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(99,0,30,0.15)', paddingTop: 6 }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (5%)</span>
                    <span style={{ fontWeight: 600 }}>₹{gstAmount}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1.5px solid rgba(99,0,30,0.2)',
                    paddingTop: 8,
                    marginTop: 4,
                  }}>
                    <strong style={{ color: '#63001E', fontSize: '0.92rem' }}>Total Reservation Deposit:</strong>
                    <strong style={{
                      color: '#63001E',
                      fontSize: '1.18rem',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      ₹{totalDeposit}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ── Live Preview & Submit ── */}
              <motion.div
                layout
                style={{
                  padding: 20, borderRadius: 16, background: 'rgba(255,183,197,0.15)',
                  border: '1px solid rgba(99,0,30,0.12)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: 16,
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#63001E', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Booking Preview:
                  </span>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#63001E', marginTop: 4 }}>
                    {previewText}
                  </p>
                </div>
                <motion.button
                  type="submit"
                  className="btn-rose"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Confirm Reservation</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check_circle</span>
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirmation && confirmedBooking && (
          <motion.div
            className="confirmation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              className="confirmation-card"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success check animation */}
              <motion.div
                className="confirmation-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '2.2rem' }}>check</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: "'EB Garamond', serif", fontSize: '2rem', fontWeight: 700,
                  color: '#63001E', marginBottom: 12,
                }}
              >
                Reservation Confirmed!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'rgba(253,249,243,0.8)', borderRadius: 16,
                  padding: 20, marginBottom: 24, textAlign: 'left',
                  border: '1px solid rgba(99,0,30,0.08)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.85rem' }}>
                  <div><strong style={{ color: '#63001E' }}>Guest:</strong> {confirmedBooking.name}</div>
                  <div><strong style={{ color: '#63001E' }}>Phone:</strong> {confirmedBooking.phone}</div>
                  <div><strong style={{ color: '#63001E' }}>Date:</strong> {confirmedBooking.date}</div>
                  <div><strong style={{ color: '#63001E' }}>Time:</strong> {confirmedBooking.time}</div>
                  <div><strong style={{ color: '#63001E' }}>Guests:</strong> {confirmedBooking.guests}</div>
                  <div><strong style={{ color: '#63001E' }}>Seating:</strong> {confirmedBooking.partyType}</div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#63001E' }}>Welcome Drink:</strong> {confirmedBooking.tasting}
                  </div>
                  {confirmedBooking.tableName && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong style={{ color: '#63001E' }}>Table:</strong> {confirmedBooking.tableName}
                    </div>
                  )}
                  {confirmedBooking.occasion && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong style={{ color: '#63001E' }}>Occasion:</strong> {confirmedBooking.occasion}
                    </div>
                  )}
                  <div style={{ gridColumn: '1 / -1', background: 'rgba(99,0,30,0.05)', padding: '6px 10px', borderRadius: 8 }}>
                    <strong style={{ color: '#63001E' }}>Booking Deposit:</strong> ₹{confirmedBooking.depositAmount || totalDeposit} (Paid via Card/UPI)
                  </div>
                </div>
                <div style={{
                  marginTop: 16, padding: '8px 14px', borderRadius: 100,
                  background: 'rgba(16,185,129,0.1)', color: '#059669',
                  fontSize: '0.75rem', fontWeight: 700, textAlign: 'center',
                  border: '1px solid rgba(16,185,129,0.2)',
                  letterSpacing: 0.5,
                }}>
                  BOOKING ID: {confirmedBooking.id.toUpperCase()}
                </div>
              </motion.div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  className="btn-rose"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/reservations')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>receipt_long</span>
                  View My Reservations
                </motion.button>
                <button
                  className="btn-outline"
                  onClick={() => {
                    setShowConfirmation(false);
                    setForm((prev) => ({ ...prev, name: '', email: '', phone: '', occasion: '' }));
                  }}
                >
                  Book Another Table
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default BookingPage;
