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
using System.IO;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Beacon.Controllers
{
    public class HomeController : Controller
    {
        private static StoresBO _storesBO = new StoresBO();
        private static EventsBO _eventsBO = new EventsBO();
        private static GamesBO  _gamesBO = new GamesBO();

        public IActionResult Index()
        {
            return View("Views/Home/MainPage.cshtml", StoreListInfo());
        }

        //[HttpGet]
        //public ActionResult RunApp()
        //{
        //    return View("Views/Home/MainPage.cshtml", StoreListInfo());
        //}

        [HttpGet]
        public IActionResult GetStoreDetail(string JSON, int Color)
        {
            ViewBag.Color = Color;
            return PartialView("Views/PartialViews/StoreDetail.cshtml", _eventsBO.GetStoreEvents(new StoreEventModel { Store = JsonConvert.DeserializeObject<StoreDataModel>(JSON)}));
        }


        [HttpGet]
        public IActionResult GetStoreDetailEvents(string ID)
        {
            return PartialView("Views/PartialViews/StoreDetailEvents.cshtml", _eventsBO.GetStoreEvents(new StoreEventModel { Store = new StoreDataModel { Id = ID }}));
        }

        [HttpGet]
        public IActionResult GetStorePanel()
        {
            return PartialView("~/Views/PartialViews/StorePanelGroup.cshtml", StoreListInfo());
        }

        [HttpGet]
        public IActionResult GetEventPanel(string ID, int Color, bool state)
        {
            EventDataModel Panel = _eventsBO.GetEventData(ID);
            Panel.GameFK = _gamesBO.CurrentEventGame(Panel.GameFK);
            ViewBag.Color = Color;
            ViewBag.ButtonPressed = state;
            return PartialView("~/Views/PartialViews/EventPanel.cshtml", Panel);
        }

        [HttpGet]
        public string GetGames()
        {
            return JsonConvert.SerializeObject(_gamesBO.Read()); 
        }


        private List<StoreEventModel>StoreListInfo()
        {
            List<StoreDataModel> stores = _storesBO.Read();
            List<StoreEventModel> allInfo = new List<StoreEventModel>();
            foreach (StoreDataModel store in stores)
            {
                StoreEventModel temp = new StoreEventModel();
                temp.Store = store;
                temp = _eventsBO.GetStoreEvents(temp);
                allInfo.Add(temp);

            }
            return allInfo;
        }
    }

}
