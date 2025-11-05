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
	fps++;
	if(fps==10) fps=0;
	var imagen = rpta.image;
	var resultados = rpta.multiFaceLandmarks;
	var cuadro;
	ctx.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas);
    if (resultados) {		
		hayCara = true;		
		var ptoLabio = 4
        for (const landmarks of resultados) {			
			var indicesLabioExterno = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
			var indicesLabioInterno = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191];			
			var labioInterno = [];
			var labioExterno = [];
			var cli=0;
			var cle=0;
			var indice;
			for(var i=0;i<indicesLabioExterno.length;i++){				
				indice = indicesLabioExterno[i];
				if(i==0) {
					ctx.beginPath();
					ctx.moveTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);
				}
				else ctx.lineTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);
				if(i==indicesLabioExterno.length-1) {
					ctx.lineTo(landmarks[indicesLabioExterno[0]].x * anchoCanvas,landmarks[indicesLabioExterno[0]].y * altoCanvas);
					ctx.fillStyle = "RGBA(255,0,0,0.2)";
					ctx.fill();
					ctx.closePath();
				}
			}
			for(var i=0;i<indicesLabioInterno.length;i++){				
				indice = indicesLabioInterno[i];
				if(i==0) {
					ctx.beginPath();
					ctx.moveTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);
				}
				else ctx.lineTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);
				if(i==indicesLabioInterno.length-1) {
					ctx.lineTo(landmarks[indicesLabioInterno[0]].x * anchoCanvas,landmarks[indicesLabioInterno[0]].y * altoCanvas);
					ctx.fillStyle = "RGBA(255,255,255,0.2)";
					ctx.fill();
					ctx.closePath();
				}
			}			
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