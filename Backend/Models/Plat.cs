namespace Backend.Models
{
    public class Plat
    {
        public long Id { get; set; }

        public int CategorieId { get; set; }

        public decimal? Prix { get; set; }

        public string? ImageUrl { get; set; }

        public bool Disponible { get; set; } = true;

        public int OrdreAffichage { get; set; }

        public DateTime DateCreation { get; set; }

        public DateTime DateMaj { get; set; }

        public CategorieMenu? Categorie { get; set; }

        public List<PlatTraduction> Traductions { get; set; } = new();
    }
}