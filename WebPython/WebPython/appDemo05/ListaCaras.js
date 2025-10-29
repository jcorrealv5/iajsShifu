var archivos = [];
var nArchivos = 0;
var c = 0;

window.onload = async function(){
	var rptaHttp = await fetch("ListarNombresCaras",
        {
            method: "GET",
        });
    if (rptaHttp.ok) {
        var rptaTexto = await rptaHttp.text();
		if(rptaTexto!=""){
			archivos = rptaTexto.split("|");
			nArchivos = archivos.length;
			obtenerCara();
		}
    }
}

async function obtenerCara(){
	var archivo = archivos[c];
	var rptaHttp = await fetch("ObtenerCara?Nombre=" + archivo,
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
		divCaras.insertAdjacentHTML("afterbegin", html);
		c++;
		if(c<nArchivos) obtenerCara();
   }
}