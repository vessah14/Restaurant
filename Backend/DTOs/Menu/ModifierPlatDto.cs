using Microsoft.AspNetCore.Http;

namespace Backend.Dtos.Menu
{
    public class ModifierPlatDto
    {
        public decimal? Prix { get; set; }
        public IFormFile? ImageFile { get; set; }
        public bool Disponible { get; set; }
        public int OrdreAffichage { get; set; }

        public string NomFr { get; set; } = string.Empty;
        public string? DescriptionFr { get; set; }

        public string NomEn { get; set; } = string.Empty;
        public string? DescriptionEn { get; set; }
    }
}