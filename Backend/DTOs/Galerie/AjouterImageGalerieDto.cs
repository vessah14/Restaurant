namespace Backend.Dtos.Galerie
{
    public class AjouterImageGalerieDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string Categorie { get; set; } = string.Empty;
        public int OrdreAffichage { get; set; }

        public string? TitreFr { get; set; }
        public string? TitreEn { get; set; }
    }
}