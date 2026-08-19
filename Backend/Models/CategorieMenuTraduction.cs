using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class CategorieMenuTraduction
    {
        public long Id { get; set; }

        public int CategorieId { get; set; }
    [MaxLength(10)]
        public string Langue { get; set; } = string.Empty;

        public string Nom { get; set; } = string.Empty;

        public CategorieMenu? Categorie { get; set; }
    }
}