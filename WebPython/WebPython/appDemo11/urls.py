from django.urls import path
from . import views

urlpatterns = [
    path('DeteccionManos', views.DeteccionManos, name='DeteccionManos')
]