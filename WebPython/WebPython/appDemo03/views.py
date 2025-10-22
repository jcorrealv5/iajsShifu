from django.shortcuts import render
from django.http import JsonResponse
from urllib.request import urlopen
import json

def DistritosLima(request):
    return render(request, "appDemo03/DistritosLima.html")

def ListarDistritos(request):
    rpta = ""
    url = "https://gist.githubusercontent.com/JoshuaSebastianKim/b07f774cfa67327608c4471cb7a8086d/raw/db38770fd1f70f14fff3d5000d919559ec89d0de/map.pe.json"
    rptaHttp = urlopen(url)
    if(rptaHttp.status==200):
        rptaBytes = rptaHttp.read()
        objJson = json.loads(rptaBytes)
        rpta = objJson["Lima"]["Lima"]
    return JsonResponse(rpta)