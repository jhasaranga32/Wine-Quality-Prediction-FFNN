from rest_framework import serializers
from .models import Barrel


class BarrelSerializer(serializers.ModelSerializer):
    prediction_count = serializers.SerializerMethodField()

    class Meta:
        model = Barrel
        fields = [
            'id', 'name', 'code', 'wood_type', 'capacity_liters',
            'vintage_year', 'status', 'location', 'notes',
            'prediction_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'prediction_count']

    def get_prediction_count(self, obj):
        return obj.predictions.count()
