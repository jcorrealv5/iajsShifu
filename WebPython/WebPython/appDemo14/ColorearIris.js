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
	ctx.fillStyle="red";
    if (resultados) {		
		hayCara = true;
		var irisDerecho = [];
		var irisIzquierdo = [];
        for (const landmarks of resultados) {			
			for(var i=468;i<471;i++){
				irisDerecho.push([landmarks[i].x * anchoCanvas, landmarks[i].y * altoCanvas]);
			}
			for(var i=473;i<landmarks.length-2;i++){
				irisIzquierdo.push([landmarks[i].x * anchoCanvas, landmarks[i].y * altoCanvas]);
			}
			centroIrisDerecho = irisDerecho[0];		
			radioHorizontalDerecho = Math.abs(irisDerecho[1][0] - irisDerecho[0][0]);
			radioVerticalDerecho = Math.abs(irisDerecho[0][1] - irisDerecho[2][1]);
					
			centroIrisIzquierdo = irisIzquierdo[0];
			radioHorizontalIzquierdo = Math.abs(irisIzquierdo[1][0] - irisIzquierdo[0][0]);
			radioVerticalIzquierdo = Math.abs(irisIzquierdo[0][1] - irisIzquierdo[2][1]);
			
			var N=5;
			ctx.beginPath();
			ctx.arc(centroIrisDerecho[0], centroIrisDerecho[1], radioHorizontalDerecho - N, radioVerticalDerecho - N, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc(centroIrisIzquierdo[0], centroIrisIzquierdo[1], radioHorizontalIzquierdo - N, radioVerticalIzquierdo - N, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			/*for(var i=0;i<irisIzquierdo.length;i++){
				ctx.fillRect(irisIzquierdo[i][0] - 2, irisIzquierdo[i][1] - 2, 4, 4);
			}
			for(var i=0;i<irisDerecho.length;i++){
				ctx.fillRect(irisDerecho[i][0] - 2, irisDerecho[i][1] - 2, 4, 4);
			}*/
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