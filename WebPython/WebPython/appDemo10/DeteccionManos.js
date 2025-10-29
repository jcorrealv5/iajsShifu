var hands;
var ctx, anchoCanvas, altoCanvas, ctxMano;
var hayManos = false;

window.onload = function(){
	ctx = canvas.getContext("2d");
	ctxMano = canvasMano.getContext("2d");
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	iniciarDeteccion();
	
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
	ctx.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas);
    if (resultados) {
		for (const landmarks of resultados) {
			hayManos = true;
			cuadro = getBoundingBox(landmarks);
			var ancho = (cuadro.xMax - cuadro.xMin) * anchoCanvas;
			var alto = (cuadro.yMax - cuadro.yMin) * altoCanvas;
			var x = Math.floor(cuadro.xMin * anchoCanvas);
			var y = Math.floor(cuadro.yMin * altoCanvas);
			ctxMano.drawImage(canvas,x,y,ancho,alto,0,0,canvasMano.width,canvasMano.height);
			drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5});
			drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });
		}
    }
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