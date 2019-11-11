using Beacon.Models;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Models
{
    public class StoreEventModel
    {
        public List<EventDataModel> Events = new List<EventDataModel>();
        public StoreDataModel Store { get; set; }
        public int TotalParticipants { get; set; }
        public int CurrentEvents { get; set; }

    }
}
