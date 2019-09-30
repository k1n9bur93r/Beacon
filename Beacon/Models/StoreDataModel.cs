using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Models
{
    public class StoreDataModel
    {
        [Key]
        public string Id { get; set; }
        [Required]
        [MaxLength(2048)]
        public string Address { get; set; }
        [Required]
        [MaxLength(2048)]
        public string Name { get; set; }
        [Required]
        [MaxLength(256)]
        public int Zip {get;set;}
        [Required]
        [MaxLength(256)]
        public string City {get;set;}
        [Required]
        [MaxLength(256)]
        public string State {get;set;}
        [Required]
        [MaxLength(1)]
        public int Deleted { get; set; }

    }
}
