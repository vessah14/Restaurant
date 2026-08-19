namespace Backend.Dtos.ReseauSocial
{
    public class ModifierReseauSocialDto
    {
        public string Plateforme { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int OrdreAffichage { get; set; }
    }
}