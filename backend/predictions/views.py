from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import WinePrediction
from .serializers import WinePredictionSerializer, PredictionInputSerializer
from .ml_service import predict_wine_quality


class PredictAndSaveView(APIView):
    """POST /api/predictions/ — Run prediction and save result."""

    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            predicted_quality = predict_wine_quality(data)
        except Exception as e:
            return Response(
                {'error': f'Prediction failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        quality_label = WinePrediction.get_quality_label(predicted_quality)

        prediction = WinePrediction.objects.create(
            fixed_acidity=data['fixed_acidity'],
            volatile_acidity=data['volatile_acidity'],
            citric_acid=data['citric_acid'],
            residual_sugar=data['residual_sugar'],
            chlorides=data['chlorides'],
            free_sulfur_dioxide=data['free_sulfur_dioxide'],
            total_sulfur_dioxide=data['total_sulfur_dioxide'],
            density=data['density'],
            ph=data['ph'],
            sulphates=data['sulphates'],
            alcohol=data['alcohol'],
            barrel_id=data.get('barrel'),
            predicted_quality=predicted_quality,
            quality_label=quality_label,
            notes=data.get('notes', ''),
        )

        return Response(WinePredictionSerializer(prediction).data, status=status.HTTP_201_CREATED)


class PredictionListView(APIView):
    """GET /api/predictions/history/ — List all saved predictions."""

    def get(self, request):
        predictions = WinePrediction.objects.all()
        serializer = WinePredictionSerializer(predictions, many=True)
        return Response(serializer.data)


class PredictionDetailView(APIView):
    """GET/PUT/DELETE /api/predictions/<id>/"""

    def get(self, request, pk):
        prediction = get_object_or_404(WinePrediction, pk=pk)
        return Response(WinePredictionSerializer(prediction).data)

    def put(self, request, pk):
        prediction = get_object_or_404(WinePrediction, pk=pk)
        # Allow updating notes and barrel only
        allowed_fields = ['notes', 'barrel']
        for field in allowed_fields:
            if field in request.data:
                setattr(prediction, field if field != 'barrel' else 'barrel_id', request.data[field])
        prediction.save()
        return Response(WinePredictionSerializer(prediction).data)

    def delete(self, request, pk):
        prediction = get_object_or_404(WinePrediction, pk=pk)
        prediction.delete()
        return Response({'message': 'Prediction deleted.'}, status=status.HTTP_204_NO_CONTENT)


class PredictPreviewView(APIView):
    """POST /api/predictions/preview/ — Run prediction WITHOUT saving."""

    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            predicted_quality = predict_wine_quality(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'predicted_quality': round(predicted_quality, 4),
            'quality_label': WinePrediction.get_quality_label(predicted_quality),
        })
