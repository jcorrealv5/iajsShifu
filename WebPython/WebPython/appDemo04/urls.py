from django.urls import path
from . import views

urlpatterns = [
    path('CapturaFoto', views.CapturaFoto, name='CapturaFoto'),
    path('GrabarFoto', views.GrabarFoto, name='GrabarFoto'),
    path('ListaFotos', views.ListaFotos, name='ListaFotos'),
    path('ListarNombresFotos', views.ListarNombresFotos, name='ListarNombresFotos'),
    path('ObtenerFoto', views.ObtenerFoto, name='ObtenerFoto'),
]