from django.urls import path
from . import views

urlpatterns = [
    path('PintarLabios', views.PintarLabios, name='PintarLabios')
]