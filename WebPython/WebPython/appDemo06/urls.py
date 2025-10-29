from django.urls import path
from . import views

urlpatterns = [
    path('MarcasFaciales', views.MarcasFaciales, name='MarcasFaciales')
]