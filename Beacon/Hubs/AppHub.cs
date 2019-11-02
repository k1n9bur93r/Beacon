﻿using System;
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
            EventsBO eventBo = new EventsBO();
            if (function == 1)
                eventBo.IncEventParticipants(eventId);
            else if (function == -1)
                eventBo.DecEventParticipants(eventId);

            await Clients.All.SendAsync("GetEventUpdate", eventId,storeId,function);
        }

        public async Task PostNewEvent(string eventData, bool IsToday, string Time,string StoreId)
        {

            HomeController controller = new HomeController();

            EventDataModel newEvent=controller.CreateEvent(eventData,IsToday,Time);
            string html= "<div><div id=\"" + newEvent.Id + "\"><p id=\"name\"> Name: " + newEvent.EventName + " </p> <div id=\"attending\" num=\"" + newEvent.Participants + "\">People Attending:<p id=\"number\"> " + newEvent.Participants + "</p></div><button id=\"IncStoreEvent\" EventId=\"" + newEvent.Id + "\">I'm Going!</button><button id=\"DecStoreEvent\" EventId=\"" + newEvent.Id + "\" hidden>Never Mind...</button></div></div>";
            await Clients.All.SendAsync("GetNewEvent", html,StoreId);
        }

        public async Task PostNewStore(string newStore) {
            HomeController controller = new HomeController();
            StoreDataModel store= controller.CreateStore(newStore);
            string html = "<div StoreId=\""+store.Id+"\" id=\"StorePanel\"><h2>"+store.Name+"</h2><p>"+store.Address+" </p></div>";
            string JSON = JsonConvert.SerializeObject(store);
            await Clients.All.SendAsync("GetNewStore",html,JSON);

        }
    }
}
