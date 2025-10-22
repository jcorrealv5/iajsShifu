from django.shortcuts import render

def inicio(request):
    with open("Alumnos.txt", "r") as file:alumnos = file.read()
    return render(request, "appDemo02/inicio.html", 
    context = {"Alumnos":alumnos})