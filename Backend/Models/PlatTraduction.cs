using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class PlatTraduction
    {
        public long Id { get; set; }

        public long PlatId { get; set; }
[MaxLength(10)]
        public string Langue { get; set; } = string.Empty;
[MaxLength(50)]
        public string Nom { get; set; } = string.Empty;

        public string? Description { get; set; }

        public Plat? Plat { get; set; }
    }
}