import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPrediction, deletePrediction, updatePrediction } from '../api/predictionApi';
import PredictionResult from '../components/PredictionResult';

const FIELD_LABELS = {
  fixed_acidity: 'Fixed Acidity',
  volatile_acidity: 'Volatile Acidity',
  citric_acid: 'Citric Acid',
  residual_sugar: 'Residual Sugar',
  chlorides: 'Chlorides',
  free_sulfur_dioxide: 'Free SO₂',
  total_sulfur_dioxide: 'Total SO₂',
  density: 'Density',
  ph: 'pH',
  sulphates: 'Sulphates',
  alcohol: 'Alcohol',
};

export default function PredictionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPrediction(id)
      .then(r => { setPrediction(r.data); setNotes(r.data.notes || ''); })
      .catch(() => setError('Prediction not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const { data } = await updatePrediction(id, { notes });
      setPrediction(data);
    } catch {
      setError('Failed to update notes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this prediction?')) return;
    await deletePrediction(id);
    navigate('/history');
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;
  if (error) return <div className="page-container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link to="/history" style={{ color: 'var(--burgundy)', textDecoration: 'none', fontSize: 14 }}>← Back to History</Link>
        <span style={{ color: 'var(--muted)' }}>|</span>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--burgundy)' }}>
          Prediction #{prediction.id}
        </h1>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-danger" style={{ fontSize: 13 }} onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16, color: 'var(--slate)' }}>Chemical Properties</h3>
            <div className="grid-3">
              {Object.entries(FIELD_LABELS).map(([key, label]) => (
                <div key={key} style={{ padding: '10px 14px', background: 'var(--cream)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--charcoal)' }}>{prediction[key]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: 12, color: 'var(--slate)' }}>Notes</h3>
            <textarea
              className="form-textarea"
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this sample..."
              style={{ resize: 'vertical', marginBottom: 12 }}
            />
            <button className="btn btn-primary" onClick={handleSaveNotes} disabled={saving}>
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 88 }}>
          <PredictionResult result={prediction} />
          {prediction.barrel_name && (
            <div style={{ marginTop: 12, padding: '14px 16px', background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 14 }}>
              🛢 Barrel: <strong>{prediction.barrel_name}</strong>
            </div>
          )}
          <div style={{ marginTop: 12, padding: '14px 16px', background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--muted)' }}>
            Created: {new Date(prediction.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
