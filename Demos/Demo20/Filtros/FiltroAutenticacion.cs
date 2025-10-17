using System.Web.Mvc; //ActionFilterAttribute

namespace Demo20.Filtros
{
    public class FiltroAutenticacion: ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if(filterContext.HttpContext.Session["Usuario"]==null) filterContext.Result = new RedirectResult("~/Video/Login");
        }
    }
}