from django.urls import path
from . import views

urlpatterns = [
    path('OjosCerrados', views.OjosCerrados, name='OjosCerrados')
]