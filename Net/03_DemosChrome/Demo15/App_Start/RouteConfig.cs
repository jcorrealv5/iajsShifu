using System.Web.Mvc;
using System.Web.Routing;

namespace Demo15
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Prompt", action = "Imagen", id = UrlParameter.Optional }
            );
        }
    }
}
