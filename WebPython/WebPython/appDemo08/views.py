from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
import base64, os
from PIL import Image

def MallaFacial(request):
    return render(request, "appDemo08/MallaFacial.html")