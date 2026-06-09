import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const LABEL_STYLES = {
  Poor: { bg: '#fde8e8', color: '#c0392b', emoji: '😟' },
  Average: { bg: '#fef3cd', color: '#856404', emoji: '😐' },
  Good: { bg: '#d4edda', color: '#155724', emoji: '😊' },
  Excellent: { bg: '#d1ecf1', color: '#0c5460', emoji: '🌟' },
};

export default function PredictionResult({ result, onSave, saving }) {
  if (!result) return null;

  const { predicted_quality, quality_label } = result;
  const style = LABEL_STYLES[quality_label] || LABEL_STYLES['Average'];
  const score = Math.round(predicted_quality * 10) / 10;
  const pct = (score / 10) * 100;

  const chartData = [{ value: pct, fill: 'var(--burgundy)' }];

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--burgundy) 0%, #4a0e1a 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '32px',
      color: 'white',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 16 }}>
        Prediction Result
      </p>

      <div style={{ width: 180, height: 180, margin: '0 auto 16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="70%" outerRadius="100%"
            startAngle={90} endAngle={-270}
            data={chartData}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background={{ fill: 'rgba(255,255,255,0.1)' }}
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ position: 'relative', marginTop: -20 }}>
        <p style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--gold-light)',
        }}>
          {score.toFixed(1)}
        </p>
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>out of 10</p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: style.bg,
          color: style.color,
          padding: '6px 18px',
          borderRadius: 20,
          fontWeight: 700,
          fontSize: 15,
          marginBottom: 24,
        }}>
          {style.emoji} {quality_label}
        </div>

        {onSave && (
          <div>
            <button
              className="btn btn-gold"
              onClick={onSave}
              disabled={saving}
              style={{ fontSize: 15, padding: '12px 28px' }}
            >
              {saving ? '💾 Saving...' : '💾 Save Prediction'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
