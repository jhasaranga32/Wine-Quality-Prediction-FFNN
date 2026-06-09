import os
import numpy as np
import joblib
from django.conf import settings

# Lazy-loaded globals
_model = None
_data_scaler = None
_target_scaler = None
_use_mock = False


def _load_model():
    global _model, _data_scaler, _target_scaler, _use_mock

    model_path = os.path.join(settings.ML_MODELS_DIR, 'best_model.keras')
    data_scaler_path = os.path.join(settings.ML_MODELS_DIR, 'data_scaler.pkl')
    target_scaler_path = os.path.join(settings.ML_MODELS_DIR, 'target_scaler.pkl')

    if not os.path.exists(model_path):
        print("[ML Service] WARNING: Model files not found. Using mock prediction.")
        _use_mock = True
        return

    try:
        import tensorflow as tf
        _model = tf.keras.models.load_model(model_path)
        _data_scaler = joblib.load(data_scaler_path)
        _target_scaler = joblib.load(target_scaler_path)
        print("[ML Service] Model loaded successfully.")
        _use_mock = False
    except Exception as e:
        print(f"[ML Service] Failed to load model: {e}. Using mock prediction.")
        _use_mock = True


def predict_wine_quality(input_data: dict) -> float:
    """
    Predict wine quality from input features.
    Returns a float quality score (typically 0–10).
    """
    global _model, _data_scaler, _target_scaler, _use_mock

    if _model is None and not _use_mock:
        _load_model()

    feature_order = [
        'fixed_acidity',
        'volatile_acidity',
        'citric_acid',
        'residual_sugar',
        'chlorides',
        'free_sulfur_dioxide',
        'total_sulfur_dioxide',
        'density',
        'ph',
        'sulphates',
        'alcohol',
    ]

    features = np.array([[input_data[f] for f in feature_order]], dtype=np.float32)

    if _use_mock:
        return _mock_predict(features[0])

    scaled_features = _data_scaler.transform(features)
    raw_prediction = _model.predict(scaled_features, verbose=0)
    quality_score = _target_scaler.inverse_transform(raw_prediction)[0][0]
    return float(np.clip(quality_score, 0, 10))


def _mock_predict(features: np.ndarray) -> float:
    """
    Heuristic mock prediction when no model is available.
    Based on domain knowledge of wine chemistry.
    """
    # features: [fixed_acidity, volatile_acidity, citric_acid, residual_sugar,
    #            chlorides, free_sulfur_dioxide, total_sulfur_dioxide,
    #            density, ph, sulphates, alcohol]
    score = 5.0
    score += (features[10] - 10.0) * 0.3   # alcohol (higher → better)
    score -= (features[1] - 0.3) * 2.0     # volatile_acidity (lower → better)
    score += (features[9] - 0.5) * 0.8     # sulphates (moderate → better)
    score += (features[2] - 0.3) * 0.5     # citric_acid (moderate → better)
    score -= (features[4] - 0.08) * 3.0    # chlorides (lower → better)
    return float(np.clip(score, 1, 10))
