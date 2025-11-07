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
			var indicesOjoIzquierdo = [362, 385, 387, 263, 373, 380];
			var indicesOjoDerecho = [33, 160, 158, 133, 153, 144];
			dibujarOjo(landmarks, indicesOjoIzquierdo);
			dibujarOjo(landmarks, indicesOjoDerecho);
			var ptosOjoIzquierdo = [];
			for(var i=0;i<indicesOjoIzquierdo.length;i++)
			{
				ptosOjoIzquierdo.push(landmarks[indicesOjoIzquierdo[i]]);
			}
			var ptosOjoDerecho = [];
			for(var i=0;i<indicesOjoDerecho.length;i++)
			{
				ptosOjoDerecho.push(landmarks[indicesOjoDerecho[i]]);
			}
			var earOjoIzquierdo = get_ear(ptosOjoIzquierdo);
			var earOjoDerecho = get_ear(ptosOjoDerecho);
			//console.log("earOjoIzquierdo: " + earOjoIzquierdo);
			//console.log("earOjoDerecho: " + earOjoDerecho);
			var earPromedio = (earOjoIzquierdo + earOjoDerecho) / 2.0;
			var umbral = 0.20;
			if(earPromedio<umbral){
				spnEstado.innerText = "Cerrado";
			}
			else{
				spnEstado.innerText = "Abierto";
			}
        }
    }
}

function dibujarOjo(landmarks, indicesOjo){
	ctx.strokeStyle = "red";
	ctx.lineWidth = 1;
	var indice = 0;
	ctx.beginPath();
	for(var i=0;i<indicesOjo.length;i++){				
		indice = indicesOjo[i];
		if(i==0) {					
			ctx.moveTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);
		}
		else ctx.lineTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);				
	}
	ctx.lineTo(landmarks[indicesOjo[0]].x * anchoCanvas,landmarks[indicesOjo[0]].y * altoCanvas);
	ctx.stroke();
	ctx.closePath();
}

function get_ear(eye_points){
    var vertical_dist_1 = Math.hypot(eye_points[1].x - eye_points[5].x, eye_points[1].y - eye_points[5].y);
    var vertical_dist_2 = Math.hypot(eye_points[2].x - eye_points[4].x, eye_points[2].y - eye_points[4].y);
    var horizontal_dist = Math.hypot(eye_points[0].x - eye_points[3].x, eye_points[0].y - eye_points[3].y);
    var ear = (vertical_dist_1 + vertical_dist_2) / (2.0 * horizontal_dist);
    return ear;	
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