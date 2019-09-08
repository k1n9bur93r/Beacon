using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using DB;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace Beacon.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            List<StoreDataModel> locations = new List<StoreDataModel>();
            //this using statement creates our connection to the database
            using (var context = new ApplicationDBContext())
            {
                context.Database.EnsureCreated();
                
                if (context.Stores.Any())
                {
                    foreach (var location in context.Stores)
                    {
                        locations.Add(location);
                    }
                }
            }


            return View(locations);
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
    }
}
