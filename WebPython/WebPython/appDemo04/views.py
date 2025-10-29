from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
import base64, os
from PIL import Image

def CapturaFoto(request):
    return render(request, "appDemo04/CapturaFoto.html")

@xframe_options_exempt
def GrabarFoto(request):
    rpta = ""
    nombre = request.POST.get("Nombre")
    fotoBase64 = request.POST.get("Foto")
    base64_bytes = fotoBase64.encode('ascii')
    buffer = base64.b64decode(base64_bytes)
    archivoLarge = "appDemo04/Fotos/Large/" + nombre + ".jpg"
    with open(archivoLarge, "wb") as file:
        file.write(buffer)
    archivoSmall = "appDemo04/Fotos/Small/" + nombre + ".jpg"
    img = Image.open(archivoLarge)
    img = img.convert('RGB')
    resized_img = img.resize((200, 200))
    resized_img.save(archivoSmall, quality=75)
    rpta = "Se creo el archivo: " + nombre + ".jpg"
    return HttpResponse(rpta)

def ListaFotos(request):
    return render(request, "appDemo04/ListaFotos.html")

def ListarNombresFotos(request):
    rpta = ""
    rutaFotos = "C:/Data/NET/Cursos/2025_09_IAJS/WebPython/appDemo04/Fotos/Small"
    archivos = os.listdir(rutaFotos)
    nArchivos = len(archivos)
    for c,archivo in enumerate(archivos):
        rpta += archivo
        if(c<nArchivos-1):
            rpta += "|"
    return HttpResponse(rpta)

def ObtenerFoto(request):
    rpta = None
    nombre = request.GET.get("Nombre")
    tipo = request.GET.get("Tipo")
    rutaFotos = "C:/Data/NET/Cursos/2025_09_IAJS/WebPython/appDemo04/Fotos/" + tipo
    archivo = os.path.join(rutaFotos, nombre)
    if(os.path.isfile(archivo)):
        with open(archivo, "rb") as file:
            rpta = file.read()
    return HttpResponse(rpta, "image/jpg")