using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class FaqTraduction
    {
        public long Id { get; set; }

        public long FaqId { get; set; }
[MaxLength(10)]
        public string Langue { get; set; } = string.Empty; // "fr" ou "en"

        public string Question { get; set; } = string.Empty;

        public string Reponse { get; set; } = string.Empty;

        public Faq? Faq { get; set; }
    }
}