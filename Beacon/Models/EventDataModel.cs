using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Beacon.Models
{
    public class EventDataModel
    {
        [Key]
        public string Id { get; set; }
        [Required]
        [MaxLength(2048)]
        public string EventName { get; set; }
        [Required]
        [MaxLength(2048)]
        public string EventType { get; set; }
        [Required]
        [MaxLength(2048)]
        public DateTime StartDate { get; set; }
        [Required]
        [MaxLength(2048)]
        public DateTime EndDate { get; set; }
        [MaxLength(2048)]
        public int Participants { get; set; }
        [Required]
        [MaxLength(1)]
        public int Deleted { get; set; }
    }
}
