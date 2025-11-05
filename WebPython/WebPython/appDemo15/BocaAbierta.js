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
			var centroLabioSuperior = landmarks[13].y;
			var centroLabioInferior = landmarks[14].y;
			var distancia = Math.abs(centroLabioInferior - centroLabioSuperior);
			var umbral = 0.02;
			if(distancia>umbral) spnEstado.innerText = "Abierta";
			else spnEstado.innerText = "Cerrada";
			
			cuadro = getBoundingBox(landmarks);
			var ancho = (cuadro.xMax - cuadro.xMin) * anchoCanvas;
			var alto = (cuadro.yMax - cuadro.yMin) * altoCanvas;
			var x = Math.floor(cuadro.xMin * anchoCanvas);
			var y = Math.floor(cuadro.yMin * altoCanvas);
			ctxCara.drawImage(canvas,x,y,ancho,alto,0,0,canvasCara.width,canvasCara.height);
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