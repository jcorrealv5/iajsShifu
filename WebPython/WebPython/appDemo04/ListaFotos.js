var archivos = [];
var nArchivos = 0;
var c = 0;

window.onload = async function(){
	var rptaHttp = await fetch("ListarNombresFotos",
        {
            method: "GET",
        });
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
		if(rptaTexto!=""){
			archivos = rptaTexto.split("|");
			nArchivos = archivos.length;
			obtenerFotoSmall();
		}
    }
}

async function obtenerFotoSmall(){
	var archivo = archivos[c];
	var rptaHttp = await fetch("ObtenerFoto?Nombre=" + archivo + "&Tipo=Small",
        {
            method: "GET",
        });
    if (rptaHttp.ok) {
        var blob = await rptaHttp.blob();
		var html = "<div class='MarcoVideo' id='div";
		html += archivo;
		html += "'>";
		html += "<img id='img";
		html += archivo;
		html += "' src = '";
		html += URL.createObjectURL(blob);
		html += "' class='MarcoImagen2'/>";
		html += "<br/>";
		html += "<span class='Titulo'>";
		html += archivo;
		html += "</span>";
		html += "</div>";
		divFotos.insertAdjacentHTML("afterbegin", html);
		c++;
		if(c<nArchivos) obtenerFotoSmall();
		configurarDescargaFoto();
    }
}

function configurarDescargaFoto(){
	var imgs = document.getElementsByClassName("MarcoImagen2");
	var nImgs = imgs.length;
	for(var i=0;i<nImgs;i++){
		imgs[i].onclick = async function(){
			var archivo = this.id.substring(3, this.id.length);
			var rptaHttp = await fetch("ObtenerFoto?Nombre=" + archivo + "&Tipo=Large",
			{
				method: "GET",
			});
			if (rptaHttp.ok) {
				var blob = await rptaHttp.blob();
				var enlace = document.createElement("a");
				enlace.href = URL.createObjectURL(blob);
				enlace.download = archivo;
				enlace.click();
			}
		}
	}
}