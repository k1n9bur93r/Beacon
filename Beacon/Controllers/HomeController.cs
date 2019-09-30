using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DB;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Models;
using Beacon.BL;
using Beacon.Models;
using System.IO;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Beacon.Controllers
{
    public class HomeController : Controller
    {
        IServiceProvider serviceProvider;
        public IActionResult Index()
        {
            StoresBO storesBO = new StoresBO();

            return View(storesBO.Read());
        }
        [HttpGet]
        public IActionResult GetStoreInfo(string JSON)
        {
            StoreEventModel storeEvents = new StoreEventModel();
            
            storeEvents.Store= JsonConvert.DeserializeObject<StoreDataModel>(JSON);
            EventsBO eventsBO = new EventsBO();
            storeEvents.Events= eventsBO.GetStoreEvents(storeEvents.Store.Id);

            return PartialView("Views/PartialViews/StoreEventData.cshtml", storeEvents);
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        protected string RenderPartialViewToString(string viewName, object model)
        {
            model = new object();
            if (string.IsNullOrEmpty(viewName))
                viewName = ControllerContext.ActionDescriptor.DisplayName;

            ViewData.Model = model;

            using (StringWriter sw = new StringWriter())
            {
                var engine = serviceProvider.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine; // Resolver.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine;
                ViewEngineResult viewResult = engine.FindView(ControllerContext, viewName, false);

                ViewContext viewContext = new ViewContext(
                    ControllerContext,
                    viewResult.View,
                    ViewData,
                    TempData,
                    sw,
                    new HtmlHelperOptions() //Added this parameter in
                );

                //Everything is async now!
                var t = viewResult.View.RenderAsync(viewContext);
                t.Wait();

                return sw.GetStringBuilder().ToString();
            }
        }
    }

}
