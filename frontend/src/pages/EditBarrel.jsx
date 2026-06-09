import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBarrel, updateBarrel } from '../api/barrelApi';

export default function EditBarrel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getBarrel(id)
      .then(r => setForm(r.data))
      .catch(() => setError('Barrel not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    try {
      await updateBarrel(id, {
        ...form,
        capacity_liters: parseFloat(form.capacity_liters),
        vintage_year: form.vintage_year ? parseInt(form.vintage_year) : null,
      });
      navigate('/barrels');
    } catch (e) {
      setError(JSON.stringify(e.response?.data) || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;
  if (!form) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 28 }}>
        <Link to="/barrels" style={{ color: 'var(--burgundy)', textDecoration: 'none', fontSize: 14 }}>← Back to Barrels</Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--burgundy)', marginTop: 8 }}>Edit Barrel</h1>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Barrel Name *</label>
            <input className="form-input" value={form.name} onChange={e => handleChange('name', e.target.value)} disabled={saving} />
          </div>
          <div className="form-group">
            <label className="form-label">Barrel Code *</label>
            <input className="form-input" value={form.code} onChange={e => handleChange('code', e.target.value)} disabled={saving} />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Wood Type</label>
            <select className="form-select" value={form.wood_type} onChange={e => handleChange('wood_type', e.target.value)} disabled={saving}>
              {['oak', 'cherry', 'chestnut', 'acacia', 'mahogany', 'other'].map(w => (
                <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Capacity (L)</label>
            <input className="form-input" type="number" value={form.capacity_liters} onChange={e => handleChange('capacity_liters', e.target.value)} disabled={saving} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)} disabled={saving}>
              {['active', 'aging', 'empty', 'retired'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Vintage Year</label>
            <input className="form-input" type="number" value={form.vintage_year || ''} onChange={e => handleChange('vintage_year', e.target.value)} disabled={saving} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" value={form.location} onChange={e => handleChange('location', e.target.value)} disabled={saving} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" rows={3} value={form.notes || ''} onChange={e => handleChange('notes', e.target.value)} disabled={saving} style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving} style={{ padding: '11px 28px' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/barrels" className="btn btn-secondary">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
