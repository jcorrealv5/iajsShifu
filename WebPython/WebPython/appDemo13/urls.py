from django.urls import path
from . import views

urlpatterns = [
    path('DeteccionHolistica', views.DeteccionHolistica, name='DeteccionHolistica')
]