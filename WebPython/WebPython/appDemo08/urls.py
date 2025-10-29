from django.urls import path
from . import views

urlpatterns = [
    path('MallaFacial', views.MallaFacial, name='MallaFacial')
]