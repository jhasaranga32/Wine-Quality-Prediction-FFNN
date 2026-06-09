import React from 'react';

const FIELDS = [
  { key: 'fixed_acidity', label: 'Fixed Acidity', hint: 'g/dm³ tartaric acid (4–16)', step: 0.1, min: 0 },
  { key: 'volatile_acidity', label: 'Volatile Acidity', hint: 'g/dm³ acetic acid (0.1–1.6)', step: 0.01, min: 0 },
  { key: 'citric_acid', label: 'Citric Acid', hint: 'g/dm³ (0–1)', step: 0.01, min: 0 },
  { key: 'residual_sugar', label: 'Residual Sugar', hint: 'g/dm³ (1–16)', step: 0.1, min: 0 },
  { key: 'chlorides', label: 'Chlorides', hint: 'g/dm³ sodium chloride (0.01–0.6)', step: 0.001, min: 0 },
  { key: 'free_sulfur_dioxide', label: 'Free SO₂', hint: 'mg/dm³ (1–72)', step: 1, min: 0 },
  { key: 'total_sulfur_dioxide', label: 'Total SO₂', hint: 'mg/dm³ (6–289)', step: 1, min: 0 },
  { key: 'density', label: 'Density', hint: 'g/cm³ (0.990–1.004)', step: 0.0001, min: 0 },
  { key: 'ph', label: 'pH', hint: '(2.7–4.0)', step: 0.01, min: 0, max: 14 },
  { key: 'sulphates', label: 'Sulphates', hint: 'g/dm³ potassium sulphate (0.3–2.0)', step: 0.01, min: 0 },
  { key: 'alcohol', label: 'Alcohol', hint: '% volume (8–15)', step: 0.1, min: 0, max: 100 },
];

export default function WineInputForm({ values, onChange, barrels = [], loading }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--slate)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🧪</span> Chemical Properties
        </h3>
        <div className="grid-3">
          {FIELDS.map(({ key, label, hint, step, min, max }) => (
            <div className="form-group" key={key} style={{ marginBottom: 0 }}>
              <label className="form-label">{label}</label>
              <input
                type="number"
                className="form-input"
                step={step}
                min={min}
                max={max}
                value={values[key] ?? ''}
                onChange={e => onChange(key, e.target.value)}
                disabled={loading}
                placeholder="0.00"
              />
              <div className="form-hint">{hint}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Barrel (optional)</label>
          <select
            className="form-select"
            value={values.barrel ?? ''}
            onChange={e => onChange('barrel', e.target.value || null)}
            disabled={loading}
          >
            <option value="">— No barrel —</option>
            {barrels.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={values.notes ?? ''}
            onChange={e => onChange('notes', e.target.value)}
            disabled={loading}
            placeholder="Optional notes about this sample..."
            style={{ resize: 'vertical' }}
          />
        </div>
      </div>
    </div>
  );
}
