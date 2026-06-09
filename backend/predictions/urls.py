from django.urls import path
from .views import PredictAndSaveView, PredictionListView, PredictionDetailView, PredictPreviewView

urlpatterns = [
    path('', PredictAndSaveView.as_view(), name='predict-and-save'),
    path('history/', PredictionListView.as_view(), name='prediction-history'),
    path('preview/', PredictPreviewView.as_view(), name='predict-preview'),
    path('<int:pk>/', PredictionDetailView.as_view(), name='prediction-detail'),
]
