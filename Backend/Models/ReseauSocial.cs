namespace Backend.Models
{
    public class ReseauSocial
    {
        public int Id { get; set; }

        public string Plateforme { get; set; } = string.Empty; // "Instagram", "Facebook"...

        public string Url { get; set; } = string.Empty;

        public int OrdreAffichage { get; set; }
    }
}