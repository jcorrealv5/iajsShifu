using System; //Convert
using System.Web.Mvc; //ActionResult, File
using System.IO; //Path
using io=System.IO; //File

namespace Demo16.Controllers
{
    public class VideoController : Controller
    {
        public ActionResult Captura()
        {
            return View();
        }

        public string grabarFrame()
        {
            string rpta = "";
            string item = Request.Form["Item"];
            string imgBase64 = Request.Form["Frame"];
            string rutaVideo = Server.MapPath("~/Video");
            string archivoImagen = Path.Combine(rutaVideo, item + ".png");
            byte[] buffer = Convert.FromBase64String(imgBase64);
            io.File.WriteAllBytes(archivoImagen, buffer);
            rpta = "OK";
            return rpta;
        }

        public ActionResult Reproduccion()
        {
            return View();
        }

        public string contarFrames()
        {
            string rpta = "";
            string rutaVideo = Server.MapPath("~/Video");
            string[] archivos = io.Directory.GetFiles(rutaVideo, "*.png");
            rpta = archivos.Length.ToString();
            return rpta;
        }

        public string obtenerFrame(string item)
        {
            string rpta = "";
            string rutaVideo = Server.MapPath("~/Video");
            string archivoImagen = Path.Combine(rutaVideo, item + ".png");
            byte[] buffer = io.File.ReadAllBytes(archivoImagen);
            rpta = Convert.ToBase64String(buffer);
            return rpta;
        }
    }
}