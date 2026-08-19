using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class Galerie
    {
        public long Id { get; set; }

        [Required]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        public string Categorie { get; set; } = string.Empty; // "interieur", "plats", "ambiance", "details", "evenements"

        public int OrdreAffichage { get; set; }

        public DateTime DateAjout { get; set; }

        public List<GalerieTraduction> Traductions { get; set; } = new();
    }
}