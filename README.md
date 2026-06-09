# 🍷 Wine Barrel Prediction System

Full-stack wine quality prediction app using React + Django + PyMySQL + a Keras ML model.

---

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Vite, React Router, Recharts |
| Backend  | Django 4.2, Django REST Framework |
| Database | MySQL via PyMySQL |
| ML       | TensorFlow/Keras `.keras` model + scikit-learn scalers |

---

## Quick Start

### 1. MySQL Setup

```sql
CREATE DATABASE wine_prediction_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DB credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# (Optional) Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: http://localhost:8000

### 3. Add Your ML Model (Optional)

Place these files in `backend/ml_models/`:
- `best_model.keras` — your trained Keras model
- `data_scaler.pkl` — fitted `StandardScaler` for input features
- `target_scaler.pkl` — fitted `StandardScaler` for quality output

**Feature order the model expects:**
```
fixed_acidity, volatile_acidity, citric_acid, residual_sugar,
chlorides, free_sulfur_dioxide, total_sulfur_dioxide, density,
ph, sulphates, alcohol
```

If no model is present, the system uses a chemistry-based heuristic prediction automatically.

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

---

## API Reference

### Predictions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predictions/` | Predict + save |
| POST | `/api/predictions/preview/` | Predict only (no save) |
| GET | `/api/predictions/history/` | List all predictions |
| GET | `/api/predictions/<id>/` | Get single prediction |
| PUT | `/api/predictions/<id>/` | Update notes/barrel |
| DELETE | `/api/predictions/<id>/` | Delete prediction |

### Barrels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/barrels/` | List all barrels |
| POST | `/api/barrels/` | Create barrel |
| GET | `/api/barrels/<id>/` | Get barrel |
| PUT | `/api/barrels/<id>/` | Update barrel |
| DELETE | `/api/barrels/<id>/` | Delete barrel |

### Sample Prediction Request

```json
POST /api/predictions/preview/
{
  "fixed_acidity": 7.4,
  "volatile_acidity": 0.7,
  "citric_acid": 0.0,
  "residual_sugar": 1.9,
  "chlorides": 0.076,
  "free_sulfur_dioxide": 11,
  "total_sulfur_dioxide": 34,
  "density": 0.9978,
  "ph": 3.51,
  "sulphates": 0.56,
  "alcohol": 9.4
}
```

Response:
```json
{
  "predicted_quality": 5.73,
  "quality_label": "Average"
}
```

### Quality Labels

| Score | Label |
|-------|-------|
| < 4.5 | Poor |
| 4.5 – 6.0 | Average |
| 6.0 – 7.5 | Good |
| ≥ 7.5 | Excellent |

---

## Project Structure

```
wine-barrel-prediction-system/
├── backend/
│   ├── backend/         # Django project settings
│   ├── predictions/     # ML prediction app
│   │   └── ml_service.py  # Model loading + inference
│   ├── barrels/         # Barrel CRUD app
│   └── ml_models/       # Place .keras + .pkl files here
└── frontend/
    └── src/
        ├── api/         # Axios API clients
        ├── components/  # Navbar, WineInputForm, PredictionResult
        └── pages/       # All page views
```
