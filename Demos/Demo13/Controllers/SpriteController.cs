using System.Web.Mvc;
using io=System.IO;
using System.Drawing;

namespace Demo13.Controllers
{
    public class SpriteController : Controller
    {
        public ActionResult Gorila()
        {
            string archivoSpriteImagen = Server.MapPath("~/Imagenes/Gorila.jpg");
            if (io.File.Exists(archivoSpriteImagen))
            {
                Bitmap bmp = new Bitmap(archivoSpriteImagen);
                ViewBag.Ancho = bmp.Width;
                ViewBag.Alto = bmp.Height;
            }
            string archivoSpriteTexto = Server.MapPath("~/Files/Sprite.txt");
            if (io.File.Exists(archivoSpriteTexto))
            {
                string[] lineas = io.File.ReadAllLines(archivoSpriteTexto);
                ViewBag.Filas = lineas[0].Split('=')[1];
                ViewBag.Cols = lineas[1].Split('=')[1];
            }
            return View();
        }
    }
}