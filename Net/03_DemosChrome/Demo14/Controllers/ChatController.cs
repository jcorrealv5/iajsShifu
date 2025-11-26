using System.Web.Mvc;

namespace Demo14.Controllers
{
    public class ChatController : Controller
    {
        // GET: Chat
        public ActionResult PromptTexto()
        {
            return View();
        }
    }
}