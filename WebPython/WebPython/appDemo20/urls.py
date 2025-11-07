from django.urls import path
from . import views

urlpatterns = [
    path('LookAutomatico', views.LookAutomatico, name='LookAutomatico')
]