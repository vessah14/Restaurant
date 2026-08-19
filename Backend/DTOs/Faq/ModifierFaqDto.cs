namespace Backend.Dtos.Faq
{
    public class ModifierFaqDto
    {
        public int OrdreAffichage { get; set; }
        public string QuestionFr { get; set; } = string.Empty;
        public string ReponseFr { get; set; } = string.Empty;
        public string QuestionEn { get; set; } = string.Empty;
        public string ReponseEn { get; set; } = string.Empty;
    }
}