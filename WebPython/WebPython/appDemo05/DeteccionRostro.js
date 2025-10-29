var faceDetection;
var ctx, ancho, alto, ctxCara;
var hayCara = false;

window.onload = function(){
	ctx = canvas.getContext("2d");
	ctxCara = canvasCara.getContext("2d");
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	iniciarDeteccion();
	
	btnActivarCamara.onclick = function(){
		iniciarCamara();
	}

	btnTomarFoto.onclick = function(){
		if(hayCara) {
			imgCara.src = canvasCara.toDataURL();
		}
		else alert("No hay cara para la toma");
	}
	btnEnviarFoto.onclick = async function(){
		enviarFoto();
	}
}

function iniciarDeteccion(){
	faceDetection = new FaceDetection({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229/${file}`;
        }
    });
    faceDetection.setOptions({
        modelSelection: 0,
        model: "short",
        minDetectionConfidence: 0.5
    });
    faceDetection.onResults(mostrarImagen);
}

function iniciarCamara(){
	var camara = new Camera(video, {
		onFrame: async () => {
			await faceDetection.send({ image: video });
		},
		width: 800,
		height: 700
    });
    camara.start();
}

function mostrarImagen(rpta){
	var imagen = rpta.image;
	var resultados = rpta.detections;
	//ctx.save();
	ctx.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas);	
	if(resultados.length>0){
		hayCara = true;
		var resultado = resultados[0];
		var cuadro = resultado.boundingBox;
		ctx.lineWidth = 3;
		ctx.strokeStyle = "green";
		var ancho = cuadro.width * anchoCanvas;
        var alto = cuadro.height * altoCanvas;
		var x = Math.floor((cuadro.xCenter - (cuadro.width/2)) * anchoCanvas);
		var y = Math.floor((cuadro.yCenter - (cuadro.height/2)) * altoCanvas);
		ctx.strokeRect(x,y,ancho,alto);
		ctxCara.drawImage(canvas,x,y,ancho,alto,0,0,canvasCara.width,canvasCara.height);
	}
	else hayCara = false;
}

async function enviarFoto() {
    var imgBase64 = imgCara.src.replace("data:image/png;base64,","");
    var frm = new FormData();
	var token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    frm.append("csrfmiddlewaretoken", token);
	frm.append("Nombre", txtNombre.value);
    frm.append("Foto", imgBase64);
    var rptaHttp = await fetch("GrabarCara",
        {
            method: "POST",
            body: frm
        });
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
        alert(rptaTexto);
    }
}