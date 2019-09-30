using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Beacon.Models
{
    public class GameDataModel
    {
        [Key]
        public string Id { get; set; }
        [Required]
        [MaxLength(2048)]
        public string Name { get; set; }
        [Required]
        [MaxLength(2048)]
        public string Type { get; set; }
        [Required]
        [MaxLength(1)]
        public int Deleted { get; set; }
    }
}
