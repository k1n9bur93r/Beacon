using Beacon.DAL;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Beacon.BL
{
    public class EventsBO
    {
        private readonly IEventsDAO _EventsDAO;

        public EventsBO()
        {
            _EventsDAO = new EventsDAO();
        }

        #region Read
        private List<EventDataModel> Read()
        {
            return _EventsDAO.ReadAll();
        }
        #endregion

        #region Insert
        private void Insert(EventDataModel data)
        {
            _EventsDAO.Insert(data);
        }
        #endregion

        #region Delete
        private void Delete(EventDataModel data)
        {
            _EventsDAO.Delete(data);
        }
        #endregion

        #region Update
        private void Update(EventDataModel data)
        {
            _EventsDAO.Update(data);
        }
        #endregion

        public EventDataModel createNewEvent(EventDataModel newEvent,string Time)
        {
            newEvent.Id = Guid.NewGuid().ToString();
            newEvent.StartDate = DateTime.Parse(Time);
            newEvent.EndDate = newEvent.StartDate.AddHours(8);
            this.Insert(newEvent);
            return newEvent;
        }
        public List<EventDataModel> GetStoreEvents(string storeID)
        {
            List<EventDataModel> allEvents = _EventsDAO.ReadByStore(storeID); 
            return allEvents;
        }

        public int GetCurrentParticipants(List<EventDataModel> data)
        {
            int counter = 0;
            foreach (EventDataModel singleEvent in data)
            {
                if (singleEvent.EndDate > DateTime.Now) counter += singleEvent.Participants;
                
            }
            return counter;
        }
        public int GetCurrentEvents(List<EventDataModel> data)
        {
            int counter = 0;
            foreach (EventDataModel singleEvent in data)
            {
                if (singleEvent.EndDate > DateTime.Now) counter++;
            }
            return counter;
        }
        public void IncEventParticipants(string eventID)
        {
            EventDataModel events=_EventsDAO.ReadEvent(eventID);
            events.Participants++;
            _EventsDAO.Update(events);
        }
        public void DecEventParticipants(string eventID)
        {
            EventDataModel events = _EventsDAO.ReadEvent(eventID);
            events.Participants--;
            _EventsDAO.Update(events);
        }
    }
}
