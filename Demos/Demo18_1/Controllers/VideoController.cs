using System.Web.Mvc; //ActionResult, File
using System.Configuration; //ConfigurationManager

namespace Demo18.Controllers
{
    public class VideoController : Controller
    {
        public ActionResult Captura()
        {
            ViewBag.IpWebSocket = ConfigurationManager.AppSettings["IpWebSocket"];
            return View();
        }

        public ActionResult Reproduccion()
        {
            ViewBag.IpWebSocket = ConfigurationManager.AppSettings["IpWebSocket"];
            return View();
        }
    }
}