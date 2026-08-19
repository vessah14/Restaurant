using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PageContenu
    {
        public long Id { get; set; }

        public int PageId { get; set; }

        [MaxLength(10)]
        public string Langue { get; set; } = string.Empty;

        public string? Titre { get; set; }

        public string? Contenu { get; set; }

        public string? MetaTitre { get; set; }

        public string? MetaDescription { get; set; }

        public DateTime DateMaj { get; set; }

        public Page? Page { get; set; }
    }
}