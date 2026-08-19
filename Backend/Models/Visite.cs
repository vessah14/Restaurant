using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Visite
    {
        public long Id { get; set; }

        [MaxLength(128)]
        public string SessionId { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Source { get; set; }

        [MaxLength(200)]
        public string? Page { get; set; }

        public DateTime DateVisite { get; set; }
    }
}
