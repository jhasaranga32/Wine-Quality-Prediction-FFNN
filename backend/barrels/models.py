from django.db import models


class Barrel(models.Model):
    WOOD_CHOICES = [
        ('oak', 'Oak'),
        ('cherry', 'Cherry'),
        ('chestnut', 'Chestnut'),
        ('acacia', 'Acacia'),
        ('mahogany', 'Mahogany'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('aging', 'Aging'),
        ('empty', 'Empty'),
        ('retired', 'Retired'),
    ]

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    wood_type = models.CharField(max_length=50, choices=WOOD_CHOICES, default='oak')
    capacity_liters = models.FloatField()
    vintage_year = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    location = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'barrels'

    def __str__(self):
        return f"{self.name} ({self.code})"
