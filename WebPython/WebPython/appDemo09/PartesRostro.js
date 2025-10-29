var faceMesh;
var ctx, anchoCanvas, altoCanvas, ctxCara;
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
			cuadro = getBoundingBox(landmarks);
			var ancho = (cuadro.xMax - cuadro.xMin) * anchoCanvas;
			var alto = (cuadro.yMax - cuadro.yMin) * altoCanvas;
			var x = Math.floor(cuadro.xMin * anchoCanvas);
			var y = Math.floor(cuadro.yMin * altoCanvas);
			ctxCara.drawImage(canvas,x,y,ancho,alto,0,0,canvasCara.width,canvasCara.height);
			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.moveTo(x + (ancho/2), y + (3*alto/8));
			ctx.lineTo(x + (3*ancho/8), y + (5*alto/8));
			ctx.lineTo(x + (5*ancho/8), y + (5*alto/8));
			ctx.lineTo(x + (ancho/2), y + (3*alto/8));
			ctx.fill();
			ctx.closePath();
			drawConnectors(ctx, landmarks, FACEMESH_FACE_OVAL,{ color: '#FF0000', lineWidth: 2 });
			drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYE, { color: '#00FF00', lineWidth: 2 });
			drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#000000', lineWidth: 2 });
			drawConnectors(ctx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#0000FF', lineWidth: 2 });
			drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYE, { color: '#00FF00', lineWidth: 2 });
			drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#000000', lineWidth: 2 });
			drawConnectors(ctx, landmarks, FACEMESH_LEFT_IRIS, { color: '#0000FF', lineWidth: 2 });
			drawConnectors(ctx, landmarks, FACEMESH_LIPS, { color: '#FF0000', lineWidth: 2 });
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