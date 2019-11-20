using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Beacon.BL;
using Microsoft.AspNetCore.SignalR;
using Beacon.Controllers;
using Microsoft.AspNetCore.Mvc;
using Models;
using Newtonsoft.Json;

namespace Beacon.Hubs
{
    public class AppHub : Hub
    {
  
        public async Task PostEventUpdate(string eventId,string storeId,int function)
        {
            bool isCurrentEvent = false;
            EventsBO eventBo = new EventsBO();
            StoresBO storesBO = new StoresBO();
            if (function == 1)
                eventBo.IncEventParticipants(eventId);
            else if (function == -1)
                eventBo.DecEventParticipants(eventId);
            List<EventDataModel>storeEvent=eventBo.GetStoreEvents(storeId);
            EventDataModel single = storeEvent.Find(a => a.Id==eventId);
            StoreDataModel singleStore = storesBO.ReadIndividual(storeId);
            if (single.EndDate > DateTime.Now) isCurrentEvent = true;
            await Clients.All.SendAsync("GetEventUpdate", eventId,storeId,function,isCurrentEvent, singleStore.Name);
        }

        public async Task PostNewEvent(string eventData, bool IsToday, string Time,string StoreId,int currentColor)
        {
            bool isCurrentEvent = false;
            HomeController controller = new HomeController();

            EventDataModel newEvent=controller.CreateEvent(eventData,IsToday,Time);
            if (newEvent.EndDate > DateTime.Now) isCurrentEvent = true;
            //  string html= "<div><div id=\"" + newEvent.Id + "\"><p id=\"name\"> Name: " + newEvent.EventName + " </p> <div id=\"attending\" num=\"" + newEvent.Participants + "\">People Attending:<p id=\"number\"> " + newEvent.Participants + "</p></div><button id=\"IncStoreEvent\" EventId=\"" + newEvent.Id + "\">I'm Going!</button><button id=\"DecStoreEvent\" EventId=\"" + newEvent.Id + "\" hidden>Never Mind...</button></div></div>";
            string html = "<div id=\"" + newEvent.Id + "\" EndTime =\""+ newEvent.EndDate + "\" class=\"Event_Margin  Event_Sub_Structure Event_SubTheme_"+currentColor+"\"><div><p id=\"name\" class=\"Side_By_Side_Data BitFont_Tight\">" + newEvent.EventName + "</p><p id = \"attending\" num=\"" + newEvent.Participants + "\" class=\"Side_By_Side_Data BitFont_Tight\"> : </p><p id = \"number\" class=\"Side_By_Side_Data BitFont_Tight\"> " + newEvent.Participants + "</p><p id = \"attending\" num=\"" + newEvent.Participants + "\" class=\"Side_By_Side_Data BitFont_Tight\">&nbsp;Attending</p> </div><div class=\"Center_Button\"><button id = \"IncStoreEvent\" EventId=\"" + newEvent.Id + "\" class=\"Event_Button_Go BitFont_Large\">I'm Going!</button><button id = \"DecStoreEvent\" EventId=\"" + newEvent.Id + "\" class=\"Event_Button_No No_Show BitFont_Large\">Never Mind...</button> </div> </div>";

              StoresBO storesBO = new StoresBO();
            StoreDataModel temp = storesBO.ReadIndividual(newEvent.StoreFK);
            await Clients.All.SendAsync("GetNewEvent", html,StoreId,newEvent.EventName,temp.Name,isCurrentEvent);
        }

        public async Task PostNewStore(string newStore,string CurrentColor,string currentNumber) {
            HomeController controller = new HomeController();
            StoreDataModel store= controller.CreateStore(newStore);
           //"<div StoreId=\""+store.Id+"\" id=\"StorePanel\"><h2>"+store.Name+"</h2><p>"+store.Address+" </p></div>";
            string html = "<div StoreId = \"" + store.Id + "\" color = \"'"+CurrentColor+"\" id = \"StorePanel\" class=\"Panel_Margin Store_Theme_" + CurrentColor + " Panel_Spacing \"><div class=\"Remove_Margin\"><h3 class=\"Side_By_Side_Data BitFont_Tight \">"+currentNumber+":&nbsp; </h3><h2 class=\"Side_By_Side_Data BitFont_Large \"> " + store.Name + "</h2> </div><div id = \"storeEvents\" storeId=\"" + store.Id + "\" ><h4 class=\"Side_By_Side_Data Remove_Margin BitFont_Tight\">No Current Events&nbsp;</h4><h3 class=\"Side_By_Side_Data Remove_Margin\"></h3></div><div id = \"storeParticipants\" storeId=\"" + store.Id + "\" hidden><h4 class=\"Side_By_Side_Data Remove_Margin BitFont_Tight\">Current Particpants:&nbsp;</h4><h3 class=\"Side_By_Side_Data Remove_Margin BitFont_Tight\"> <strong>0</strong></h3></div></div>";
            string JSON = JsonConvert.SerializeObject(store);
            await Clients.All.SendAsync("GetNewStore",html,JSON);

        }
    }
}
