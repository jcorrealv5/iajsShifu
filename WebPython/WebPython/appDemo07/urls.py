from django.urls import path
from . import views

urlpatterns = [
    path('RegistroEmpleado', views.RegistroEmpleado, name='RegistroEmpleado'),
    path('GrabarEmpleado', views.GrabarEmpleado, name='GrabarEmpleado'),
    path('Login', views.Login, name='Login'),
    path('ValidarLogin', views.ValidarLogin, name='ValidarLogin'),
    path('ConsultaEmpleados', views.ConsultaEmpleados, name='ConsultaEmpleados'),
    path('ListarEmpleados', views.ListarEmpleados, name='ListarEmpleados'),
    path('ObtenerCara', views.ObtenerCara, name='ObtenerCara'),
    path('Inicio', views.Inicio, name='Inicio'),
    path('ListarMenus', views.ListarMenus, name='ListarMenus')
]