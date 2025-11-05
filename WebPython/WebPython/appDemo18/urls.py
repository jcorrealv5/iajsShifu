from django.urls import path
from . import views

urlpatterns = [
    path('PintarBigotes', views.PintarBigotes, name='PintarBigotes')
]