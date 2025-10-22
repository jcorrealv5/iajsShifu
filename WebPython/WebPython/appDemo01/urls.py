from django.urls import path
from . import views

urlpatterns = [
    path('Inicio', views.Inicio, name='Inicio')
]