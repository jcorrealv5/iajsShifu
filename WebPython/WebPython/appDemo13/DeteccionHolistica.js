var holistic;
var ctx, anchoCanvas, altoCanvas, ctxHolistica;

window.onload = function(){
	ctx = canvas.getContext("2d");
	ctxHolistica = canvasHolistica.getContext("2d");
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	iniciarDeteccion();
	reconocimientoVoz();
	
	btnActivarCamara.onclick = function(){
		iniciarCamara();
	}

	btnTomarFoto.onclick = function(){
		imgHolistica.src = canvasHolistica.toDataURL();
	}
}

function iniciarDeteccion(){
	holistic = new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
        }
    });
    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    holistic.onResults(mostrarImagen);
}

function iniciarCamara(){
	var camara = new Camera(video, {
		onFrame: async () => {
			await holistic.send({ image: video });
		},
		width: 800,
		height: 700
    });
    camara.start();
}

function mostrarImagen(rpta){
	var imagen = rpta.image;
	var cuadro;		
	//Sobrescribir solo los píxeles existentes
	ctx.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas);
	ctx.globalCompositeOperation = 'source-in';
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, anchoCanvas, altoCanvas);
	//Sobrescribir solo los píxeles que faltan
	ctx.globalCompositeOperation = 'destination-atop';
	ctx.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas);
	ctx.globalCompositeOperation = 'source-over';
	ctxHolistica.fillStyle = '#000000';
	ctxHolistica.fillRect(0, 0, 200, 200);
	dibujarHolistica(ctx, rpta);
	dibujarHolistica(ctxHolistica, rpta);
}

function dibujarHolistica(contexto, resultado){
	drawConnectors(contexto, resultado.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
	drawLandmarks(contexto, resultado.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
	drawConnectors(contexto, resultado.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
	drawConnectors(contexto, resultado.leftHandLandmarks, HAND_CONNECTIONS, { color: '#CC0000', lineWidth: 5 });
	drawLandmarks(contexto, resultado.leftHandLandmarks, { color: '#00FF00', lineWidth: 2 });
	drawConnectors(contexto, resultado.rightHandLandmarks, HAND_CONNECTIONS, { color: '#00CC00', lineWidth: 5 });
	drawLandmarks(contexto, resultado.rightHandLandmarks, { color: '#FF0000', lineWidth: 2 });			
}

function ejecutarComandoVoz(palabras, comando){
	if(comando=="foto") btnTomarFoto.click();
}

function reconocimientoVoz() {
    if ('webkitSpeechRecognition' in window) {
        var recognizing = false;
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        iniciarReconocimiento();

        recognition.onresult = function (event) {
            var palabras = event.results[event.results.length - 1][0].transcript.trim();
            var palabra = palabras.split(" ");
            var comando = "";
            if (palabra.length > 0) {
                comando = palabra[0];
                var spnComando = document.getElementById("spnComando");
                if (spnComando != null) spnComando.innerHTML = palabras;
            }
            ultimoComando = comando;
            ejecutarComandoVoz(palabras, comando);
        };

        recognition.onstart = function () {
            //alert("Iniciando Reconocimiento");
            recognizing = true;
        };

        recognition.onend = function () {
            //alert("Finalizando Reconocimiento");
            recognizing = false;
        };

        recognition.onerror = function (event) {
            alert(event.error);
        };

        function iniciarReconocimiento() {
            if (recognizing) {
                recognition.stop();
                return;
            }
            recognition.lang = "es-PE";
            recognition.start();
        }
    }
}