var faceMesh;
var ctx, anchoCanvas, altoCanvas, ctxCara;
var hayCara = false;
var fps = 0;

window.onload = function(){
	ctx = canvas.getContext("2d");
	ctxCara = canvasCara.getContext("2d");
	anchoCanvas = canvas.width;
	altoCanvas = canvas.height;
	iniciarDeteccion();
	
	btnActivarCamara.onclick = function(){
		iniciarCamara();
	}
}

function iniciarDeteccion(){
	faceMesh = new FaceMesh({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
        }
    });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    faceMesh.onResults(mostrarImagen);
}

function iniciarCamara(){
	var camara = new Camera(video, {
		onFrame: async () => {
			await faceMesh.send({ image: video });
		},
		width: 800,
		height: 700
    });
    camara.start();
}

function mostrarImagen(rpta){
	var imagen = rpta.image;
	var resultados = rpta.multiFaceLandmarks;
	var cuadro;
	ctx.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas);
    if (resultados) {		
		hayCara = true;
        for (const landmarks of resultados) {			
			var indicesCejaIzquierda = [70, 63, 105, 66, 107];
			var indicesCejaDerecha = [336, 296, 334, 293, 300];
			dibujarCeja(landmarks, indicesCejaIzquierda, 20);
			dibujarCeja(landmarks, indicesCejaDerecha, 20);
        }
    }
}

function dibujarCeja(landmarks, indicesCeja, altoCeja){
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	var indice = 0;
	ctx.beginPath();
	for(var i=0;i<indicesCeja.length;i++){				
		indice = indicesCeja[i];
		if(i==0) {					
			ctx.moveTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);
		}
		else ctx.lineTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);				
	}
	ctx.lineTo(landmarks[indice].x * anchoCanvas,(landmarks[indice].y * altoCanvas)+altoCeja);
	for(var i=indicesCeja.length-1;i>=0;i--){				
		indice = indicesCeja[i];
		ctx.lineTo(landmarks[indice].x * anchoCanvas,(landmarks[indice].y * altoCanvas)+altoCeja);
	}
	ctx.lineTo(landmarks[indice].x * anchoCanvas,(landmarks[indice].y * altoCanvas));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
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