namespace Backend.Dtos.Faq
{
    public class FaqDto
    {
        public long Id { get; set; }
        public int OrdreAffichage { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Reponse { get; set; } = string.Empty;
    }
}