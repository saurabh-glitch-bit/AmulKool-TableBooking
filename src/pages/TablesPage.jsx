/**
 * TablesPage.jsx — Page 1: Display Restaurant Tables
 * Features: Search by name, filter by table type, animated table cards
 * Uses: useState, useEffect, Framer Motion animations
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TABLES_DATA, { TABLE_TYPES } from '../data/tablesData';

// Stagger animation for grid children
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function TablesPage() {
  // ── State: search query & active filter ──
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredTables, setFilteredTables] = useState(TABLES_DATA);

  // ── useEffect: filter & search tables whenever inputs change ──
  useEffect(() => {
    let result = TABLES_DATA;

    // Filter by type
    if (activeFilter !== 'All') {
      result = result.filter((t) => t.type === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          t.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    setFilteredTables(result);
  }, [searchQuery, activeFilter]);

  return (
    <section style={{ padding: '40px 20px 80px', maxWidth: 1280, margin: '0 auto' }}>
      {/* ── Section Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <span className="section-eyebrow">
          <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>table_restaurant</span>
          Our Dining Spaces
        </span>
        <h1 className="section-title">Choose Your Perfect Table</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          From intimate candlelit alcoves to grand VIP suites — discover the perfect setting for your Amul Kool dining experience.
        </p>
      </motion.div>

      {/* ── Search & Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          marginBottom: 40,
        }}
      >
        {/* Search */}
        <div className="search-bar">
          <span className="material-symbols-outlined" style={{ color: '#837375', fontSize: '1.2rem' }}>search</span>
          <input
            type="text"
            placeholder="Search tables by name, location, or feature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tables"
          />
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {TABLE_TYPES.map((type) => (
            <button
              key={type}
              className={`filter-chip ${activeFilter === type ? 'active' : ''}`}
              onClick={() => setActiveFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Stats Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          padding: '0 4px',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: '#837375', fontWeight: 500 }}>
          Showing <strong style={{ color: '#63001E' }}>{filteredTables.length}</strong> of {TABLES_DATA.length} tables
        </span>
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#63001E',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear Filters
          </button>
        )}
      </motion.div>

      {/* ── Table Cards Grid ── */}
      {filteredTables.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {filteredTables.map((table) => (
            <motion.div key={table.id} variants={cardVariants}>
              <Link to={`/book/${table.id}`} style={{ textDecoration: 'none' }}>
                <div className="table-card">
                  {/* Badge */}
                  <div className="table-card-badge">{table.type}</div>

                  {/* Image */}
                  <img
                    className="table-card-image"
                    src={table.image}
                    alt={table.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';
                    }}
                  />

                  {/* Card Body */}
                  <div className="table-card-body">
                    <h3 className="table-card-name">{table.name}</h3>

                    <div className="table-card-detail">
                      <span className="material-symbols-outlined">group</span>
                      {table.capacity === 1 ? '1 Guest' : `Up to ${table.capacity} Guests`}
                    </div>

                    <div className="table-card-detail">
                      <span className="material-symbols-outlined">location_on</span>
                      {table.location}
                    </div>

                    <div className="table-card-detail">
                      <span className="material-symbols-outlined">payments</span>
                      {table.priceRange}
                    </div>

                    {/* Features Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                      {table.features.map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            background: 'rgba(255, 183, 197, 0.2)',
                            color: '#63001E',
                            padding: '3px 10px',
                            borderRadius: 100,
                            border: '1px solid rgba(99, 0, 30, 0.1)',
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Availability Status */}
                    <div className="table-card-status available">
                      <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>check_circle</span>
                      Available
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state"
        >
          <div className="empty-state-icon">🍽️</div>
          <h3 className="empty-state-title">No tables found</h3>
          <p className="empty-state-text">
            Try adjusting your search or filter to find available dining spaces.
          </p>
          <button
            className="btn-outline"
            style={{ marginTop: 20 }}
            onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
          >
            Show All Tables
          </button>
        </motion.div>
      )}
    </section>
  );
}

export default TablesPage;
