namespace Backend.Dtos.Galerie
{
    public class GalerieDto
    {
        public long Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Categorie { get; set; } = string.Empty;
        public string? Titre { get; set; }
        public int OrdreAffichage { get; set; }
    }
}