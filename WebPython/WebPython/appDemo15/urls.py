from django.urls import path
from . import views

urlpatterns = [
    path('BocaAbierta', views.BocaAbierta, name='BocaAbierta')
]