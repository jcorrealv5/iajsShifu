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
		var ptoLabio = 10;
        for (const landmarks of resultados) {			
			var indicesLabioExterno = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
			var labioExterno = [];
			var cle=0;
			var indice;
			var n = indicesLabioExterno.length;
			var mitad = (n/2) + (n/4);
			for(var i=(n/2);i<n;i++){				
				indice = indicesLabioExterno[i];
				labioExterno.push([landmarks[indice].x * anchoCanvas,landmarks[indice].y * altoCanvas]);
				if(i<=mitad) ctx.fillStyle = "RGB(255,255,255)";
				else ctx.fillStyle = "RGB(0,0,0)";
				//ctx.fillStyle = "RGB(0,0,0)";
				ctx.fillRect(labioExterno[cle][0]-ptoLabio,labioExterno[cle][1]-ptoLabio,ptoLabio*2,ptoLabio*2);
				cle++;
			}
			
			//Tomar la Foto cuando la Boca esta Abierta
			var centroLabioSuperior = landmarks[13].y;
			var centroLabioInferior = landmarks[14].y;
			var distancia = Math.abs(centroLabioInferior - centroLabioSuperior);
			var umbral = 0.02;
			if(distancia>umbral) {
				spnEstado.innerText = "Abierta";
				if(fps==0){
					cuadro = getBoundingBox(landmarks);
					var ancho = (cuadro.xMax - cuadro.xMin) * anchoCanvas;
					var alto = (cuadro.yMax - cuadro.yMin) * altoCanvas;
					var x = Math.floor(cuadro.xMin * anchoCanvas);
					var y = Math.floor(cuadro.yMin * altoCanvas);
					ctxCara.drawImage(canvas,x,y,ancho,alto,0,0,canvasCara.width,canvasCara.height);
					var imgCara=new Image(200,200);				
					imgCara.src = canvasCara.toDataURL();
					imgCara.onload = function(){
						divFotos.insertAdjacentHTML("afterbegin", imgCara.outerHTML);
					}
				}
			}
			else spnEstado.innerText = "Cerrada";
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