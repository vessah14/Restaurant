namespace Backend.Models
{
    public class Faq
    {
        public long Id { get; set; }

        public int OrdreAffichage { get; set; }

        public DateTime DateMaj { get; set; }

        public List<FaqTraduction> Traductions { get; set; } = new();
    }
}