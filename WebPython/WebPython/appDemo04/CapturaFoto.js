var c = 0;
var ctx = canvas.getContext("2d");
var enviar = false;

window.onload = function () {
    btnActivarCamara.onclick = function () {        
		activarCamara();
    }
	btnTomarFoto.onclick = function () {        
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);		
    }
	btnEnviarFoto.onclick = function () {        
		enviarFoto();
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

async function enviarFoto() {
    var imgBase64 = canvas.toDataURL().replace("data:image/png;base64,","");
    var frm = new FormData();
	var token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    frm.append("csrfmiddlewaretoken", token);
	frm.append("Nombre", txtNombre.value);
    frm.append("Foto", imgBase64);
    var rptaHttp = await fetch("GrabarFoto",
        {
            method: "POST",
            body: frm
        });
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
        alert(rptaTexto);
    }
}