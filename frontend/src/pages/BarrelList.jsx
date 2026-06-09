import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBarrels, deleteBarrel } from '../api/barrelApi';

const STATUS_STYLE = {
  active: { bg: '#d4edda', color: '#155724' },
  aging: { bg: '#d1ecf1', color: '#0c5460' },
  empty: { bg: '#fef3cd', color: '#856404' },
  retired: { bg: '#f8f9fa', color: '#6c757d' },
};

export default function BarrelList() {
  const [barrels, setBarrels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getBarrels().then(r => setBarrels(r.data)).catch(() => setError('Failed to load barrels.')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this barrel?')) return;
    setDeleting(id);
    try {
      await deleteBarrel(id);
      setBarrels(b => b.filter(x => x.id !== id));
    } catch {
      setError('Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--burgundy)', marginBottom: 6 }}>Barrels</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>{barrels.length} barrels registered</p>
        </div>
        <Link to="/barrels/add" className="btn btn-primary">+ Add Barrel</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading barrels...</div>
      ) : barrels.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛢</div>
          <p>No barrels yet. Add your first barrel.</p>
          <Link to="/barrels/add" className="btn btn-primary" style={{ marginTop: 16 }}>Add Barrel</Link>
        </div>
      ) : (
        <div className="grid-3" style={{ alignItems: 'start' }}>
          {barrels.map(b => {
            const st = STATUS_STYLE[b.status] || STATUS_STYLE.empty;
            return (
              <div key={b.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 2 }}>{b.name}</h3>
                    <code style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--cream)', padding: '2px 6px', borderRadius: 4 }}>{b.code}</code>
                  </div>
                  <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {b.status}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: 'var(--slate)', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                  <span>🪵 {b.wood_type.charAt(0).toUpperCase() + b.wood_type.slice(1)}</span>
                  <span>📦 {b.capacity_liters}L capacity</span>
                  {b.vintage_year && <span>📅 Vintage {b.vintage_year}</span>}
                  {b.location && <span>📍 {b.location}</span>}
                  <span>🔬 {b.prediction_count} predictions</span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/barrels/${b.id}/edit`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '7px', fontSize: 13 }}>
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '7px 14px', fontSize: 13 }}
                    onClick={() => handleDelete(b.id)}
                    disabled={deleting === b.id}
                  >
                    {deleting === b.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
