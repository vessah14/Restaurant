
namespace Backend.Dtos.Faq
{
    public class CreerFaqDto
    {
        public int OrdreAffichage { get; set; }

        // Une entrée par langue, obligatoire pour les deux (§15 : traduction non optionnelle)
        public string QuestionFr { get; set; } = string.Empty;
        public string ReponseFr { get; set; } = string.Empty;

        public string QuestionEn { get; set; } = string.Empty;
        public string ReponseEn { get; set; } = string.Empty;
    }
}