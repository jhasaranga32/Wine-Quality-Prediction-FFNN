from rest_framework import serializers
from .models import WinePrediction


class WinePredictionSerializer(serializers.ModelSerializer):
    barrel_name = serializers.SerializerMethodField()

    class Meta:
        model = WinePrediction
        fields = [
            'id',
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
            'barrel',
            'barrel_name',
            'predicted_quality',
            'quality_label',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'predicted_quality', 'quality_label', 'created_at', 'updated_at', 'barrel_name']

    def get_barrel_name(self, obj):
        if obj.barrel:
            return obj.barrel.name
        return None


class PredictionInputSerializer(serializers.Serializer):
    fixed_acidity = serializers.FloatField(min_value=0)
    volatile_acidity = serializers.FloatField(min_value=0)
    citric_acid = serializers.FloatField(min_value=0)
    residual_sugar = serializers.FloatField(min_value=0)
    chlorides = serializers.FloatField(min_value=0)
    free_sulfur_dioxide = serializers.FloatField(min_value=0)
    total_sulfur_dioxide = serializers.FloatField(min_value=0)
    density = serializers.FloatField(min_value=0)
    ph = serializers.FloatField(min_value=0, max_value=14)
    sulphates = serializers.FloatField(min_value=0)
    alcohol = serializers.FloatField(min_value=0, max_value=100)
    barrel = serializers.IntegerField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)
