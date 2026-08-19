using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class GalerieTraduction
    {
        public long Id { get; set; }

        public long GalerieId { get; set; }
[MaxLength(10)]
        public string Langue { get; set; } = string.Empty;

        public string? Titre { get; set; }

        public Galerie? Galerie { get; set; }
    }
}