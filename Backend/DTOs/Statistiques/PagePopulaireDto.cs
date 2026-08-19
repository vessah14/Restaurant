namespace Backend.Dtos.Statistiques
{
    public class PagePopulaireDto
    {
        public string Page { get; set; } = string.Empty;
        public int Visites { get; set; }
        public double Pourcentage { get; set; }
    }
}