from django.urls import path
from . import views

urlpatterns = [
    path('DistritosLima', views.DistritosLima, name='DistritosLima'),
    path('ListarDistritos', views.ListarDistritos, name='ListarDistritos')
]