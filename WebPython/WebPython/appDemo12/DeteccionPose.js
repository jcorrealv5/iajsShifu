var pose;
var ctx, anchoCanvas, altoCanvas, ctxMano;
var hayPose = false;

window.onload = function(){
	ctx = canvas.getContext("2d");
	ctxPose = canvasPose.getContext("2d");
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	iniciarDeteccion();
	reconocimientoVoz();
	
	btnActivarCamara.onclick = function(){
		iniciarCamara();
	}

	btnTomarFoto.onclick = function(){
		if(hayManos) {
			imgPose.src = canvasPose.toDataURL();
		}
		else alert("No hay pose para la toma");
	}
}

function iniciarDeteccion(){
	pose = new Pose({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635988162/${file}`;
        }
    });
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    pose.onResults(mostrarImagen);
}

function iniciarCamara(){
	var camara = new Camera(video, {
		onFrame: async () => {
			await pose.send({ image: video });
		},
		width: 800,
		height: 700
    });
    camara.start();
}

function mostrarImagen(rpta){
	var imagen = rpta.image;
	var resultado = rpta.poseLandmarks;
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
	ctxPose.fillStyle = '#000000';
	ctxPose.fillRect(0, 0, 200, 200);
    if (resultado) {		
		hayManos = true;
		cuadro = getBoundingBox(resultado);
		var ancho = (cuadro.xMax - cuadro.xMin) * anchoCanvas;
		var alto = (cuadro.yMax - cuadro.yMin) * altoCanvas;
		var x = Math.floor(cuadro.xMin * anchoCanvas);
		var y = Math.floor(cuadro.yMin * altoCanvas);									
		drawConnectors(ctx, resultado, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 5});
		drawLandmarks(ctx, resultado, { color: '#FF0000', lineWidth: 2 });			
		drawConnectors(ctxPose, resultado, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 5});
		//drawLandmarks(ctxPose, resultado, { color: '#FF0000', lineWidth: 2 });			
    }
}

function ejecutarComandoVoz(palabras, comando){
	if(comando=="foto") btnTomarFoto.click();
}

function getBoundingBox(landmarks) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < landmarks.length; i++) {
    const { x, y } = landmarks[i];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { xMin: minX, yMin: minY, xMax: maxX, yMax: maxY };
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