using Microsoft.AspNetCore.Http;

namespace Backend.Dtos.Galerie
{
    public class AjouterImageGalerieDto
    {
        public IFormFile ImageFile { get; set; } = null!;
        public string Categorie { get; set; } = string.Empty;
        public int OrdreAffichage { get; set; }

        public string? TitreFr { get; set; }
        public string? TitreEn { get; set; }
    }
}