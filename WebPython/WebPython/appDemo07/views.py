from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
import base64, os, sys, io, torch
from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1
sys.path.append("Modulos")
from modAccesoDatos import clienteSQL

def RegistroEmpleado(request):
    return render(request, "appDemo07/RegistroEmpleado.html")

def crearEmbeddingCara(img):
    mtcnn = MTCNN()
    resnet = InceptionResnetV1(pretrained='casia-webface').eval()    
    img = img.resize((160,160))
    imgCrop = mtcnn(img).unsqueeze(0)
    embeddingCara = resnet(imgCrop)    
    return embeddingCara

@xframe_options_exempt
def GrabarEmpleado(request):
    rpta = ""
    apellidos = request.POST.get("Apellidos")
    nombres = request.POST.get("Nombres")
    docIdentidad = request.POST.get("DocIdentidad")
    fechaNac = request.POST.get("FechaNac")
    sexo = request.POST.get("Sexo")
    usuario = request.POST.get("Usuario")
    fotoBase64 = request.POST.get("Foto")
    base64_bytes = fotoBase64.encode('ascii')
    buffer = base64.b64decode(base64_bytes)
    archivo = "appDemo07/Caras/" + docIdentidad + ".jpg"
    with open(archivo, "wb") as file:
        file.write(buffer)
    #Crear el Embedding usando facenet_pytorch
    img = Image.open(archivo).convert('RGB')
    embeddingCara = crearEmbeddingCara(img)
    lista = embeddingCara[0].tolist()
    strEmbedding = ",".join([f"{v:.6f}" for v in lista])
    data = "|" + apellidos + "|" + nombres + "|" + docIdentidad + "|" + fechaNac + "|" + sexo + "|" + usuario + "|" + strEmbedding
    archivoConfig = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\Config_BD_IAJS.txt"
    archivoLog = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\LogWeb.txt"
    sql = clienteSQL(archivoConfig,archivoLog)
    idEmpleado = sql.EjecutarComandoCadena("uspEmpleadoGrabarCsv", "Data", data, True)
    rpta = "Se grabo el Empleado con Id: " + idEmpleado
    return HttpResponse(rpta)

def Login(request):
    return render(request, "appDemo07/Login.html")

@xframe_options_exempt
def ValidarLogin(request):
    rpta = ""
    usuario = request.POST.get("Usuario")
    
    archivoConfig = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\Config_BD_IAJS.txt"
    archivoLog = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\LogWeb.txt"
    sql = clienteSQL(archivoConfig,archivoLog)
    idRol = sql.EjecutarComandoCadena("uspEmpleadoValidarUsuario","Usuario",usuario)
   
    if(idRol is not None and idRol!=""):
        fotoBase64 = request.POST.get("Foto")
        base64_bytes = fotoBase64.encode('ascii')
        buffer = base64.b64decode(base64_bytes)
        img = Image.open(io.BytesIO(buffer)).convert('RGB')
        embeddingValidar = crearEmbeddingCara(img)
        
        strEmbeddingReal = sql.EjecutarComandoCadena("uspEmpleadoObtenerEmbedding", "Usuario", usuario, False)
        if(strEmbeddingReal!=""):
            valoresString = strEmbeddingReal.split(",")
            valoresFloat = [float(v) for v in valoresString]
            embeddingReal = torch.tensor(valoresFloat)
            distance = (embeddingValidar - embeddingReal).norm().item()
            if distance < 1.0:
                rpta=idRol
            else:
                rpta="Error - Cara No corresponde a la registrada"
    else:
        rpta = "Error - Usuario No existe"
    return HttpResponse(rpta)

def ConsultaEmpleados(request):
    return render(request, "appDemo07/ConsultaEmpleados.html")

def ListarEmpleados(request):
    rpta = ""
    archivoConfig = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\Config_BD_IAJS.txt"
    archivoLog = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\LogWeb.txt"
    sql = clienteSQL(archivoConfig,archivoLog)
    rpta = sql.EjecutarComandoCadena("uspEmpleadoListarCsv")
    return HttpResponse(rpta)

def ObtenerCara(request):
    rpta = None
    docIdentidad = request.GET.get("DocIdentidad")
    rutaFotos = "C:/Data/NET/Cursos/2025_09_IAJS/WebPython/appDemo07/Caras/"
    archivo = os.path.join(rutaFotos, docIdentidad + ".jpg")
    if(os.path.isfile(archivo)):
        with open(archivo, "rb") as file:
            rpta = file.read()
    return HttpResponse(rpta, "image/jpg")
    
def Inicio(request):
    return render(request, "appDemo07/Inicio.html")
    
def ListarMenus(request):
    rpta = ""
    idRol = request.GET.get("IdRol")
    archivoConfig = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\Config_BD_IAJS.txt"
    archivoLog = r"C:\Data\NET\Cursos\2025_09_IAJS\WebPython\Modulos\LogWeb.txt"
    sql = clienteSQL(archivoConfig,archivoLog)
    rpta = sql.EjecutarComandoCadena("uspMenuRolListarCsv","IdRol",idRol)
    return HttpResponse(rpta)