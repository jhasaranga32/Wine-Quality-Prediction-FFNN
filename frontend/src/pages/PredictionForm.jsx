import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WineInputForm from '../components/WineInputForm';
import PredictionResult from '../components/PredictionResult';
import { previewPrediction, predictAndSave } from '../api/predictionApi';
import { getBarrels } from '../api/barrelApi';

const DEFAULTS = {
  fixed_acidity: 7.4,
  volatile_acidity: 0.7,
  citric_acid: 0.0,
  residual_sugar: 1.9,
  chlorides: 0.076,
  free_sulfur_dioxide: 11,
  total_sulfur_dioxide: 34,
  density: 0.9978,
  ph: 3.51,
  sulphates: 0.56,
  alcohol: 9.4,
  barrel: '',
  notes: '',
};

export default function PredictionForm() {
  const [values, setValues] = useState(DEFAULTS);
  const [barrels, setBarrels] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getBarrels().then(r => setBarrels(r.data)).catch(() => {});
  }, []);

  const handleChange = (key, value) => {
    setValues(v => ({ ...v, [key]: value }));
    setPreview(null);
    setSaved(false);
  };

  const handlePreview = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = buildPayload();
      const { data } = await previewPrediction(payload);
      setPreview(data);
    } catch (e) {
      setError(e.response?.data?.error || JSON.stringify(e.response?.data) || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const payload = buildPayload();
      await predictAndSave(payload);
      setSaved(true);
      setTimeout(() => navigate('/history'), 1200);
    } catch (e) {
      setError(e.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const buildPayload = () => ({
    ...Object.fromEntries(
      Object.entries(values).map(([k, v]) =>
        ['barrel', 'notes'].includes(k) ? [k, v] : [k, parseFloat(v)]
      )
    ),
    barrel: values.barrel ? parseInt(values.barrel) : null,
  });

  const handleReset = () => {
    setValues(DEFAULTS);
    setPreview(null);
    setError('');
    setSaved(false);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--burgundy)', marginBottom: 6 }}>
          Wine Quality Prediction
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15 }}>
          Enter your wine's chemical properties to predict its quality score.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 340px' : '1fr', gap: 24, alignItems: 'start' }}>
        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {saved && <div className="alert alert-success">✓ Prediction saved! Redirecting to history...</div>}

          <WineInputForm values={values} onChange={handleChange} barrels={barrels} loading={loading || saving} />

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={handlePreview} disabled={loading || saving} style={{ flex: 1, justifyContent: 'center', padding: '13px' }}>
              {loading ? '⏳ Predicting...' : '🔮 Predict Quality'}
            </button>
            <button className="btn btn-secondary" onClick={handleReset} disabled={loading || saving}>
              Reset
            </button>
          </div>
        </div>

        {preview && (
          <div style={{ position: 'sticky', top: 88 }}>
            <PredictionResult result={preview} onSave={handleSave} saving={saving} />
          </div>
        )}
      </div>
    </div>
  );
}
