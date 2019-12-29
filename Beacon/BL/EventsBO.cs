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

        public StoreEventModel GetStoreEvents(StoreEventModel Store)
        {
            Store.Events = _EventsDAO.ReadByStore(Store.Store.Id);
            foreach (EventDataModel Event in Store.Events)
            {
                if (Event.EndDate < DateTime.Now)
                    Event.Deleted = true;
                if (DateTime.Now.AddMinutes(3) > Event.StartDate && Event.EndDate > DateTime.Now)
                {
                    Store.CurrentEvents++;
                    Store.CurrentPartcipants += Event.Participants;
                }
                else if (Event.StartDate > DateTime.Now && Event.Deleted == false)
                    Store.UpcommingParticipants += Event.Participants;
            }
            return Store;
        }


        public EventDataModel GetEventData(string ID)
        {
            return ReadSingle(ID);
        }

        private List<EventDataModel> Read()
        {
            return _EventsDAO.ReadAll();
        }

        private EventDataModel ReadSingle(string Id)
        {
            return _EventsDAO.ReadEvent(Id);
        }

        #endregion

        #region Insert

        public EventDataModel createNewEvent(EventDataModel newEvent, string Time)
        {
            newEvent.Id = Guid.NewGuid().ToString();
            newEvent.StartDate = DateTime.Parse(Time);
            newEvent.EndDate = DateTime.Parse(Time);
            newEvent.EndDate = newEvent.EndDate.AddHours(8);
            this.Insert(newEvent);
            return newEvent;
        }

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

        public void IncEventParticipants(string eventID)
        {
            EventDataModel events = _EventsDAO.ReadEvent(eventID);
            events.Participants++;
            _EventsDAO.Update(events);
        }
        public void DecEventParticipants(string eventID)
        {
            EventDataModel events = _EventsDAO.ReadEvent(eventID);
            events.Participants--;
            _EventsDAO.Update(events);
        }

        private void Update(EventDataModel data)
        {
            _EventsDAO.Update(data);
        }
        #endregion
    }
}
