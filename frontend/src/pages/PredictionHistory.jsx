import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPredictionHistory, deletePrediction } from '../api/predictionApi';

const BADGE_MAP = {
  Poor: 'badge-poor',
  Average: 'badge-average',
  Good: 'badge-good',
  Excellent: 'badge-excellent',
};

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    getPredictionHistory()
      .then(r => setPredictions(r.data))
      .catch(() => setError('Failed to load predictions.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prediction?')) return;
    setDeleting(id);
    try {
      await deletePrediction(id);
      setPredictions(p => p.filter(x => x.id !== id));
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
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--burgundy)', marginBottom: 6 }}>
            Prediction History
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>{predictions.length} saved predictions</p>
        </div>
        <Link to="/predict" className="btn btn-primary">+ New Prediction</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading predictions...</div>
      ) : predictions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍷</div>
          <p>No predictions yet. Run your first prediction!</p>
          <Link to="/predict" className="btn btn-primary" style={{ marginTop: 16 }}>Make a Prediction</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {predictions.map(p => (
            <div key={p.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 36,
                  fontWeight: 700,
                  color: 'var(--burgundy)',
                  minWidth: 64,
                }}>
                  {parseFloat(p.predicted_quality).toFixed(1)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span className={`badge ${BADGE_MAP[p.quality_label] || 'badge-average'}`}>
                      {p.quality_label}
                    </span>
                    {p.barrel_name && (
                      <span style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--cream)', padding: '2px 8px', borderRadius: 4 }}>
                        🛢 {p.barrel_name}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    <span>Alcohol: <strong>{p.alcohol}%</strong></span>
                    <span style={{ margin: '0 8px' }}>·</span>
                    <span>pH: <strong>{p.ph}</strong></span>
                    <span style={{ margin: '0 8px' }}>·</span>
                    <span>Sulphates: <strong>{p.sulphates}</strong></span>
                    <span style={{ margin: '0 8px' }}>·</span>
                    <span>{new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  {p.notes && (
                    <div style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4, fontStyle: 'italic' }}>
                      "{p.notes}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/history/${p.id}`} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>
                    View
                  </Link>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '6px 14px', fontSize: 13 }}
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                  >
                    {deleting === p.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
