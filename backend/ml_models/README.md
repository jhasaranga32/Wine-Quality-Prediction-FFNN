# ML Models Directory

Place your trained model files here:

- `best_model.keras` — Keras model trained on wine quality data
- `data_scaler.pkl` — joblib-saved StandardScaler for the 11 input features
- `target_scaler.pkl` — joblib-saved StandardScaler for the quality target

## Training Script Example

```python
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf

# Load wine quality dataset
# https://archive.ics.uci.edu/ml/datasets/wine+quality
df = pd.read_csv('winequality-red.csv', sep=';')

features = ['fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar',
            'chlorides', 'free sulfur dioxide', 'total sulfur dioxide',
            'density', 'pH', 'sulphates', 'alcohol']
target = 'quality'

X = df[features].values
y = df[target].values.reshape(-1, 1)

# Scale
data_scaler = StandardScaler()
target_scaler = StandardScaler()
X_scaled = data_scaler.fit_transform(X)
y_scaled = target_scaler.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_scaled, test_size=0.2, random_state=42)

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(11,)),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.1)

# Save
model.save('best_model.keras')
joblib.dump(data_scaler, 'data_scaler.pkl')
joblib.dump(target_scaler, 'target_scaler.pkl')
print("Saved all model files.")
```

If no files are placed here, the system uses a built-in heuristic predictor automatically.
