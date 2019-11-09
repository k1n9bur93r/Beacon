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
            return View();
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

        [HttpGet]
        public string GetGames()
        {
            GamesBO gamesBO = new GamesBO();
            List<GameDataModel> gameData= gamesBO.Read();

            return JsonConvert.SerializeObject(gameData); 
        }

        [HttpGet]
        public EventDataModel CreateEvent(string JSON, bool IsToday,string Time) {

            EventDataModel newEvent = JsonConvert.DeserializeObject<EventDataModel>(JSON);
            EventsBO eventsBO = new EventsBO();
           return newEvent= eventsBO.createNewEvent(newEvent,Time);
        }

        [HttpGet]
        public StoreDataModel CreateStore(string JSON) {
            StoreDataModel newStore = JsonConvert.DeserializeObject<StoreDataModel>(JSON);
            StoresBO storeBO = new StoresBO();
            storeBO.CreateNewStore(newStore);
            return newStore;
        }

        [HttpGet]
       public ActionResult RunApp()
        {
            int tot;
            StoresBO storesBO = new StoresBO();
            EventsBO eventsBO = new EventsBO();
            List<StoreDataModel> stores = storesBO.Read();

            List<StoreEventModel> allInfo = new List<StoreEventModel>();
            foreach (StoreDataModel store in stores)
            {
                StoreEventModel temp = new StoreEventModel();
                temp.Store = store;
                temp.Events = eventsBO.GetStoreEvents(store.Id);
                temp.TotalParticipants = eventsBO.GetCurrentParticipants(temp.Events);
                temp.CurrentEvents = eventsBO.GetCurrentEvents(temp.Events);
                allInfo.Add(temp);
                
            }
           
            return View("Views/Home/MainPage.cshtml",allInfo);
            
        }

        [HttpGet]
        public void IncEventAmount(string Id)
        {
            EventsBO eventsBO = new EventsBO();
            eventsBO.IncEventParticipants(Id);
        }
        [HttpGet]
        public void DecEventAmount(string Id)
        {
            EventsBO eventsBO = new EventsBO();
            eventsBO.DecEventParticipants(Id);
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
