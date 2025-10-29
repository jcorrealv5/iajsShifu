from django.urls import path
from . import views

urlpatterns = [
    path('DeteccionRostro', views.DeteccionRostro, name='DeteccionRostro'),
    path('GrabarCara', views.GrabarCara, name='GrabarCara'),
    path('ListaCaras', views.ListaCaras, name='ListaCaras'),
    path('ListarNombresCaras', views.ListarNombresCaras, name='ListarNombresCaras'),
    path('ObtenerCara', views.ObtenerCara, name='ObtenerCara')
]