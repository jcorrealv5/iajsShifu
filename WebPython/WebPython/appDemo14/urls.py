from django.urls import path
from . import views

urlpatterns = [
    path('ColorearIris', views.ColorearIris, name='ColorearIris')
]