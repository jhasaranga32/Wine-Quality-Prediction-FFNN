import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBarrel } from '../api/barrelApi';

const DEFAULTS = {
  name: '',
  code: '',
  wood_type: 'oak',
  capacity_liters: '',
  vintage_year: '',
  status: 'active',
  location: '',
  notes: '',
};

export default function AddBarrel() {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.code || !form.capacity_liters) {
      setError('Name, code, and capacity are required.');
      return;
    }
    setLoading(true);
    try {
      await createBarrel({
        ...form,
        capacity_liters: parseFloat(form.capacity_liters),
        vintage_year: form.vintage_year ? parseInt(form.vintage_year) : null,
      });
      navigate('/barrels');
    } catch (e) {
      setError(e.response?.data?.code?.[0] || JSON.stringify(e.response?.data) || 'Failed to create barrel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <Link to="/barrels" style={{ color: 'var(--burgundy)', textDecoration: 'none', fontSize: 14 }}>← Back to Barrels</Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--burgundy)', marginTop: 8 }}>Add New Barrel</h1>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Barrel Name *</label>
            <input className="form-input" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Grand Cru Barrel A" disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Barrel Code *</label>
            <input className="form-input" value={form.code} onChange={e => handleChange('code', e.target.value)} placeholder="e.g. BRL-001" disabled={loading} />
            <div className="form-hint">Unique identifier code</div>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Wood Type</label>
            <select className="form-select" value={form.wood_type} onChange={e => handleChange('wood_type', e.target.value)} disabled={loading}>
              {['oak', 'cherry', 'chestnut', 'acacia', 'mahogany', 'other'].map(w => (
                <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Capacity (L) *</label>
            <input className="form-input" type="number" min="1" value={form.capacity_liters} onChange={e => handleChange('capacity_liters', e.target.value)} placeholder="225" disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)} disabled={loading}>
              {['active', 'aging', 'empty', 'retired'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Vintage Year</label>
            <input className="form-input" type="number" min="1900" max="2100" value={form.vintage_year} onChange={e => handleChange('vintage_year', e.target.value)} placeholder="2022" disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g. Cellar B, Row 3" disabled={loading} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" rows={3} value={form.notes} onChange={e => handleChange('notes', e.target.value)} placeholder="Optional notes..." disabled={loading} style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ padding: '11px 28px' }}>
            {loading ? 'Creating...' : 'Create Barrel'}
          </button>
          <Link to="/barrels" className="btn btn-secondary">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
