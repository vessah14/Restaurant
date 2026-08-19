using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class ContactInfosTraduction
    {
        public int Id { get; set; }
[MaxLength(10)]
        public string Langue { get; set; } = string.Empty;

        public string? Horaires { get; set; }
    }
}