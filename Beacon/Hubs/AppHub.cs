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
        private static StoresBO _storeBO = new StoresBO();
        private static EventsBO _eventsBO = new EventsBO();

        public async Task PostEventUpdate(string eventId, string storeId, int function)
        {
            bool isCurrentEvent = false;
            if (function == 1)
                _eventsBO.IncEventParticipants(eventId);
            else if (function == -1)
                _eventsBO.DecEventParticipants(eventId);

            StoreEventModel storeEvent = new StoreEventModel {
                Store = new StoreDataModel { Id = storeId }
            };
             storeEvent=_eventsBO.GetStoreEvents(storeEvent);

            EventDataModel single = storeEvent.Events.Find(a => a.Id==eventId);
            StoreDataModel singleStore = _storeBO.ReadIndividual(storeId);

            if (single.StartDate < DateTime.Now.AddMinutes(3) &&single.EndDate>DateTime.Now) isCurrentEvent = true;

            await Clients.All.SendAsync("GetEventUpdate", eventId,storeId,function,isCurrentEvent, single.EventName,singleStore.Name);
        }

        public async Task PostNewEvent(string eventDataJSON, bool IsToday, string Time,string StoreId,int currentColor)
        {
            bool isCurrentEvent = false;

            EventDataModel newEvent = JsonConvert.DeserializeObject<EventDataModel>(eventDataJSON);

            newEvent = _eventsBO.createNewEvent(newEvent, Time);
            newEvent.StartDate = DateTime.Parse(Time);
            newEvent.EndDate = DateTime.Parse(Time);
            newEvent.EndDate = newEvent.EndDate.AddHours(8);

            if (newEvent.StartDate < DateTime.Now.AddMinutes(4) && newEvent.EndDate < DateTime.Now.AddHours(9)) isCurrentEvent = true;

            StoreDataModel temp = _storeBO.ReadIndividual(newEvent.StoreFK);

            await Clients.All.SendAsync("GetNewEvent", StoreId,newEvent.Id,newEvent.EventName,temp.Name,isCurrentEvent);
        }

        public async Task PostNewStore(string newStoreJSON,string CurrentColor,int currentNumber) {
            StoreDataModel newStore = JsonConvert.DeserializeObject<StoreDataModel>(newStoreJSON);
            _storeBO.CreateNewStore(newStore);
            string JSON = JsonConvert.SerializeObject(newStore);
            await Clients.All.SendAsync("GetNewStore",JSON);

        }
    }
}
