window.onload = function () {
    var mediaRecorder = null;
    var dataArray = [];
    var audioData = null;

    btnIniciarGrabacion.onclick = async function () {
        if (btnIniciarGrabacion.value == "Iniciar Grabacion") {
            btnIniciarGrabacion.value = "Detener Grabacion";
            var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audio.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function (ev) {
                dataArray.push(ev.data);
            }

            mediaRecorder.onstop = function (ev) {
                audioData = new Blob(dataArray, { 'type': 'audio/mp3;' });
                dataArray = [];
                audioPlay.src = window.URL.createObjectURL(audioData);
            }
            mediaRecorder.start();            
        }
        else {
            btnIniciarGrabacion.value = "Iniciar Grabacion";
            audio.srcObject = null;
            mediaRecorder.stop();
            btnDescargarArchivo.style.display = "inline";
        }
    }

    audio.onloadedmetadata = function (ev) {
        audio.play();
    };

    btnDescargarArchivo.onclick = function () {
        var enlace = document.createElement("a");
        enlace.download = "Audio.mp3";
        enlace.href = window.URL.createObjectURL(audioData);
        enlace.click();
    }
}