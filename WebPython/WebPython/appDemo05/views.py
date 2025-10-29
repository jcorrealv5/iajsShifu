from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
import base64, os
from PIL import Image

def DeteccionRostro(request):
    return render(request, "appDemo05/DeteccionRostro.html")

@xframe_options_exempt
def GrabarCara(request):
    rpta = ""
    nombre = request.POST.get("Nombre")
    fotoBase64 = request.POST.get("Foto")
    base64_bytes = fotoBase64.encode('ascii')
    buffer = base64.b64decode(base64_bytes)
    archivo = "appDemo05/Caras/" + nombre + ".jpg"
    with open(archivo, "wb") as file:
        file.write(buffer)
    rpta = "Se creo el archivo: " + nombre + ".jpg"
    return HttpResponse(rpta)

def ListaCaras(request):
    return render(request, "appDemo05/ListaCaras.html")

def ListarNombresCaras(request):
    rpta = ""
    rutaFotos = "C:/Data/NET/Cursos/2025_09_IAJS/WebPython/appDemo05/Caras"
    archivos = os.listdir(rutaFotos)
    nArchivos = len(archivos)
    for c,archivo in enumerate(archivos):
        rpta += archivo
        if(c<nArchivos-1):
            rpta += "|"
    return HttpResponse(rpta)

def ObtenerCara(request):
    rpta = None
    nombre = request.GET.get("Nombre")
    rutaFotos = "C:/Data/NET/Cursos/2025_09_IAJS/WebPython/appDemo05/Caras/"
    archivo = os.path.join(rutaFotos, nombre)
    if(os.path.isfile(archivo)):
        with open(archivo, "rb") as file:
            rpta = file.read()
    return HttpResponse(rpta, "image/jpg")