using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class Page
    {
        public int Id { get; set; }

        [MaxLength(191)]
        public string Slug { get; set; } = string.Empty; // "accueil", "notre-histoire", "carte"...

        public List<PageContenu> Contenus { get; set; } = new();
    }
}