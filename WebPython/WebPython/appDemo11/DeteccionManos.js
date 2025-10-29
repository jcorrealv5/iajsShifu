var hands;
var ctx, anchoCanvas, altoCanvas, ctxMano;
var hayManos = false;

window.onload = function(){
	ctx = canvas.getContext("2d");
	ctxMano = canvasMano.getContext("2d");
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	iniciarDeteccion();
	reconocimientoVoz();
	
	btnActivarCamara.onclick = function(){
		iniciarCamara();
	}

	btnTomarFoto.onclick = function(){
		if(hayManos) {
			imgMano.src = canvasMano.toDataURL();
		}
		else alert("No hay cara para la toma");
	}
}

function iniciarDeteccion(){
	hands = new Hands({
		locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
		}
    });
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    hands.onResults(mostrarImagen);
}

function iniciarCamara(){
	var camara = new Camera(video, {
		onFrame: async () => {
			await hands.send({ image: video });
		},
		width: 800,
		height: 700
    });
    camara.start();
}

function mostrarImagen(rpta){
	var imagen = rpta.image;
	var resultados = rpta.multiHandLandmarks;
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
	ctxMano.fillStyle = '#000000';
	ctxMano.fillRect(0, 0, 200, 200);
    if (resultados) {
		for (const landmarks of resultados) {
			hayManos = true;
			cuadro = getBoundingBox(landmarks);
			var ancho = (cuadro.xMax - cuadro.xMin) * anchoCanvas;
			var alto = (cuadro.yMax - cuadro.yMin) * altoCanvas;
			var x = Math.floor(cuadro.xMin * anchoCanvas);
			var y = Math.floor(cuadro.yMin * altoCanvas);									
			drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5});
			drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });			
			drawConnectors(ctxMano, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5});
			drawLandmarks(ctxMano, landmarks, { color: '#FF0000', lineWidth: 2 });			
		}
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