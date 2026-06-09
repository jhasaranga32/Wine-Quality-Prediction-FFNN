from django.contrib import admin
from .models import Barrel


@admin.register(Barrel)
class BarrelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'code', 'wood_type', 'capacity_liters', 'status', 'vintage_year']
    list_filter = ['wood_type', 'status']
    search_fields = ['name', 'code', 'location']
