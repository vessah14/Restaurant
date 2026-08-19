using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class CategorieMenu
    {
        public int Id { get; set; }
[MaxLength(50)]
        public string Code { get; set; } = string.Empty; // "entrees", "plats", "desserts", "boissons"

        public int OrdreAffichage { get; set; }

        public List<CategorieMenuTraduction> Traductions { get; set; } = new();

        public List<Plat> Plats { get; set; } = new();
    }
}