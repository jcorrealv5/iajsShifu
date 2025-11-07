var faceMesh;
var ctx, anchoCanvas, altoCanvas, ctxCara;
var hayFoto = false;
var r = 0;
var g = 0;
var b = 0;

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
		if(hayFoto){
			var imgFoto = new Image(200,200);
			imgFoto.src = canvasCara.toDataURL();
			imgFoto.onload = function(){
				divFotos.insertAdjacentHTML("afterBegin",imgFoto.outerHTML);
			}			
		}
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
			var indicesLabioExternoSuperior = [291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
			var irisDerecho = [468, 469, 470];
			var irisIzquierdo = [473, 474, 475];
			var color = "RGB(" + r + "," + g + "," + b + ")";
			if(g==0 && b==0){
				r++;
				if(r==255) r=0;
			}
			if(r==0 && b==0){
				g++;
				if(g==255) g=0; 
			}
			if(r==0 && g==0){
				b++;
				if(b==255) b=0;
			}
			dibujarParte(landmarks, indicesCejaIzquierda, 20, color);
			dibujarParte(landmarks, indicesCejaDerecha, 20, color);
			dibujarParte(landmarks, indicesLabioExternoSuperior, -20, color);
			dibujarIris(landmarks, irisDerecho, color);
			dibujarIris(landmarks, irisIzquierdo, color);
			capturarFoto(landmarks);
        }
    }
}

function dibujarParte(landmarks, indices, alto, color){
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	var indice = 0;
	ctx.beginPath();
	for(var i=0;i<indices.length;i++){				
		indice = indices[i];
		if(i==0) {					
			ctx.moveTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);
		}
		else ctx.lineTo(landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas);				
	}
	ctx.lineTo(landmarks[indice].x * anchoCanvas,(landmarks[indice].y * altoCanvas)+alto);
	for(var i=indices.length-1;i>=0;i--){				
		indice = indices[i];
		ctx.lineTo(landmarks[indice].x * anchoCanvas,(landmarks[indice].y * altoCanvas)+alto);
	}
	ctx.lineTo(landmarks[indice].x * anchoCanvas,(landmarks[indice].y * altoCanvas));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function dibujarIris(landmarks, indiceIris, color){
	var centroIris = [landmarks[indiceIris[0]].x * anchoCanvas, landmarks[indiceIris[0]].y * altoCanvas];
	var radioHorizontal = Math.abs((landmarks[indiceIris[1]].x  * anchoCanvas) - (landmarks[indiceIris[0]].x * anchoCanvas));
	var radioVertical = Math.abs((landmarks[indiceIris[0]].y * altoCanvas) - (landmarks[indiceIris[2]].y * altoCanvas));
	var N=5;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(centroIris[0], centroIris[1], radioHorizontal - N, radioVertical - N, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.closePath();
}

function capturarFoto(landmarks){
	hayFoto = true;
	cuadro = getBoundingBox(landmarks);
	var ancho = (cuadro.xMax - cuadro.xMin) * anchoCanvas;
	var alto = (cuadro.yMax - cuadro.yMin) * altoCanvas;
	var x = Math.floor(cuadro.xMin * anchoCanvas);
	var y = Math.floor(cuadro.yMin * altoCanvas);
	ctxCara.drawImage(canvas,x,y,ancho,alto,0,0,canvasCara.width,canvasCara.height);
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