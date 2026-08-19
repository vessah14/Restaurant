namespace Backend.Dtos.Statistiques
{
    public class TraficJournalierDto
    {
        public string Jour { get; set; } = string.Empty;
        public int Visiteurs { get; set; }
        public int Reservations { get; set; }
    }
}
