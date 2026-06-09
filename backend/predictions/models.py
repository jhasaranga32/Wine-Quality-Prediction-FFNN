from django.db import models


class WinePrediction(models.Model):
    # Wine input features (standard wine quality dataset features)
    fixed_acidity = models.FloatField()
    volatile_acidity = models.FloatField()
    citric_acid = models.FloatField()
    residual_sugar = models.FloatField()
    chlorides = models.FloatField()
    free_sulfur_dioxide = models.FloatField()
    total_sulfur_dioxide = models.FloatField()
    density = models.FloatField()
    ph = models.FloatField()
    sulphates = models.FloatField()
    alcohol = models.FloatField()

    # Optional barrel reference
    barrel = models.ForeignKey(
        'barrels.Barrel',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='predictions'
    )

    # Prediction result
    predicted_quality = models.FloatField()
    quality_label = models.CharField(max_length=20)  # Poor / Average / Good / Excellent

    # Meta
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'wine_predictions'

    def __str__(self):
        return f"Prediction #{self.id} — Quality: {self.predicted_quality:.2f} ({self.quality_label})"

    @staticmethod
    def get_quality_label(score: float) -> str:
        if score < 4.5:
            return 'Poor'
        elif score < 6.0:
            return 'Average'
        elif score < 7.5:
            return 'Good'
        else:
            return 'Excellent'
