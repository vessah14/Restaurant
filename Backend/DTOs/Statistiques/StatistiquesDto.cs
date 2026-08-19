namespace Backend.Dtos.Statistiques
{
    public class StatistiquesDto
    {
        public int NombreReservations { get; set; }
        public int NombreReservationsEnAttente { get; set; }
        public int NombreUtilisateursInscrits { get; set; }
        public int NombreAvis { get; set; }
        public int NombreAvisEnAttente { get; set; }
        public double NoteMoyenne { get; set; }
        public List<EvolutionReservationsDto> EvolutionReservations { get; set; } = new();
        public List<TraficJournalierDto> TraficJournalier { get; set; } = new();
        public List<SourceTraficDto> SourcesTrafic { get; set; } = new();
        public List<HorairePopulaireDto> HorairesPopulaires { get; set; } = new();
        public List<PageStatistiquesDto> PagesPopulaires { get; set; } = new();
        public int ReservationsMois { get; set; }
        public int ReservationsConfirmeesMois { get; set; }
        public int VisiteursMois { get; set; }
        public double VisiteursEvolution { get; set; }
        public double ReservationsEvolution { get; set; }
        public double ClientsEvolution { get; set; }
        public double NoteEvolution { get; set; }
        public int VisitesTotal { get; set; }
    }
}