from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Barrel
from .serializers import BarrelSerializer


class BarrelListCreateView(APIView):

    def get(self, request):
        barrels = Barrel.objects.all()
        serializer = BarrelSerializer(barrels, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BarrelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BarrelDetailView(APIView):

    def get(self, request, pk):
        barrel = get_object_or_404(Barrel, pk=pk)
        return Response(BarrelSerializer(barrel).data)

    def put(self, request, pk):
        barrel = get_object_or_404(Barrel, pk=pk)
        serializer = BarrelSerializer(barrel, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        barrel = get_object_or_404(Barrel, pk=pk)
        barrel.delete()
        return Response({'message': 'Barrel deleted.'}, status=status.HTTP_204_NO_CONTENT)
