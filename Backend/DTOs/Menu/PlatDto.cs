namespace Backend.Dtos.Menu
{
    public class PlatDto
    {
        public long Id { get; set; }
        public string CategorieCode { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? Prix { get; set; }
        public string? ImageUrl { get; set; }
        public bool Disponible { get; set; }
        public int OrdreAffichage { get; set; }
        public DateTime DateCreation { get; set; }
    }
}