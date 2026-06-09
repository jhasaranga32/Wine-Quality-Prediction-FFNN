from django.contrib import admin
from .models import WinePrediction


@admin.register(WinePrediction)
class WinePredictionAdmin(admin.ModelAdmin):
    list_display = ['id', 'predicted_quality', 'quality_label', 'alcohol', 'barrel', 'created_at']
    list_filter = ['quality_label', 'created_at']
    search_fields = ['notes', 'quality_label']
    readonly_fields = ['predicted_quality', 'quality_label', 'created_at', 'updated_at']
