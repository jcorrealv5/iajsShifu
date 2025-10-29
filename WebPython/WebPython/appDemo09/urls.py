from django.urls import path
from . import views

urlpatterns = [
    path('PartesRostro', views.PartesRostro, name='PartesRostro')
]