from django.urls import path
from . import views

urlpatterns = [
    path('DeteccionPose', views.DeteccionPose, name='DeteccionPose')
]