using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Models
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
        public string StoreFK { get; set; }
        [Required]
        [MaxLength(2048)]
        public string GameFK { get; set; }
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
        public bool Deleted { get; set; }
    }
}
