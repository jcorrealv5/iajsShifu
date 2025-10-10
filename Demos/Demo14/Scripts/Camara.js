window.onload = function () {
    var ctx = canvas.getContext("2d");
    var canvasAncho = canvas.width;
    var canvasAlto = canvas.height;

    btnActivarCamara.onclick = function () {
        if (btnActivarCamara.value == "Activar Camara") {
            btnActivarCamara.value = "Pausar Video";
            btnTomarFoto.style.display = "inline";            
            activarCamara();
        }
        else {
            btnActivarCamara.value = "Activar Camara";
            btnTomarFoto.style.display = "none";
            video.pause();
        }
    }

    btnTomarFoto.onclick = function () {
        ctx.drawImage(video, 0, 0, canvasAncho, canvasAlto);
        btnDescargarFoto.style.display = "inline";
    }

    btnDescargarFoto.onclick = function () {
        var enlace = document.createElement("a");
        enlace.download = "Foto.png";
        enlace.href = canvas.toDataURL();
        enlace.click();
    }
}

async function activarCamara(){
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.play();
    }
    catch (error) {
        console.log('Error:', error);
    }
}