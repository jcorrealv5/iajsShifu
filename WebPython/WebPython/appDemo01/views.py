from django.http import HttpResponse

def Inicio(request):
    return HttpResponse("Hola Mundo")