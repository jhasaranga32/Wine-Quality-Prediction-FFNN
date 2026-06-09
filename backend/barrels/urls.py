from django.urls import path
from .views import BarrelListCreateView, BarrelDetailView

urlpatterns = [
    path('', BarrelListCreateView.as_view(), name='barrel-list-create'),
    path('<int:pk>/', BarrelDetailView.as_view(), name='barrel-detail'),
]
