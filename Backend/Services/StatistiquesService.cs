using Backend.Data;
using Backend.Dtos.Statistiques;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class StatistiquesService : IStatistiquesService
    {
        private readonly RestaurantDbContext _context;

        public StatistiquesService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<StatistiquesDto> GetStatistiquesGeneralesAsync()
        {
            var aujourdHui = DateTime.UtcNow;
            var debutDuMois = new DateOnly(aujourdHui.Year, aujourdHui.Month, 1);
            var debutMoisPrecedent = debutDuMois.AddMonths(-1);
            var finMoisPrecedent = new DateOnly(aujourdHui.Year, aujourdHui.Month, 1).AddDays(-1);
            var debutMoisDateTime = debutDuMois.ToDateTime(TimeOnly.MinValue);
            var debutMoisPrecedentDateTime = debutMoisPrecedent.ToDateTime(TimeOnly.MinValue);
            var finMoisPrecedentDateTime = finMoisPrecedent.AddDays(1).ToDateTime(TimeOnly.MinValue);

            // Statistiques de base
            var nombreReservations = await _context.Reservations.CountAsync();
            var nombreReservationsEnAttente = await _context.Reservations
                .CountAsync(r => r.Statut == "en_attente");

            var nombreUtilisateurs = await _context.Utilisateurs
                .CountAsync(u => u.Role.ToLower() == "client");

            var nombreAvis = await _context.Avis.CountAsync();
            var nombreAvisEnAttente = await _context.Avis
                .CountAsync(a => a.Statut == "en_attente");

            var avisPublies = await _context.Avis
                .Where(a => a.Statut == "publie")
                .ToListAsync();

            var noteMoyenne = avisPublies.Count > 0
                ? Math.Round(avisPublies.Average(a => a.Note), 1)
                : 0;

            // Évolution des réservations
            var reservationsCeMois = await _context.Reservations
                .CountAsync(r => r.DateReservation >= debutDuMois);
            var reservationsMoisPrecedent = await _context.Reservations
                .CountAsync(r => r.DateReservation >= debutMoisPrecedent && r.DateReservation <= finMoisPrecedent);
            var reservationsEvolution = reservationsMoisPrecedent > 0
                ? Math.Round(((reservationsCeMois - reservationsMoisPrecedent) / (double)reservationsMoisPrecedent) * 100, 1)
                : 0;

            // Évolution des utilisateurs
            var utilisateursCeMois = await _context.Utilisateurs
                .CountAsync(u => u.DateCreation >= debutDuMois.ToDateTime(TimeOnly.MinValue) && u.Role == "client");
            var utilisateursMoisPrecedent = await _context.Utilisateurs
                .CountAsync(u => u.DateCreation >= debutMoisPrecedent.ToDateTime(TimeOnly.MinValue)
                    && u.DateCreation <= finMoisPrecedent.ToDateTime(TimeOnly.MaxValue) && u.Role == "client");
            var clientsEvolution = utilisateursMoisPrecedent > 0
                ? Math.Round(((utilisateursCeMois - utilisateursMoisPrecedent) / (double)utilisateursMoisPrecedent) * 100, 1)
                : 0;

            // Évolution de la note moyenne
            var avisCeMois = avisPublies.Where(a => a.DateAvis >= debutDuMois).ToList();
            var avisMoisPrecedent = avisPublies.Where(a => a.DateAvis >= debutMoisPrecedent && a.DateAvis <= finMoisPrecedent).ToList();
            var noteCeMois = avisCeMois.Count > 0 ? avisCeMois.Average(a => a.Note) : 0;
            var noteMoisPrecedent = avisMoisPrecedent.Count > 0 ? avisMoisPrecedent.Average(a => a.Note) : 0;
            var noteEvolution = noteMoisPrecedent > 0
                ? Math.Round(((noteCeMois - noteMoisPrecedent) / noteMoisPrecedent) * 100, 1)
                : 0;

            var visitesTotal = await _context.Visites.CountAsync();
            var visiteursMois = await _context.Visites
                .CountAsync(v => v.DateVisite >= debutMoisDateTime);
            var visiteursMoisPrecedent = await _context.Visites
                .CountAsync(v => v.DateVisite >= debutMoisPrecedentDateTime && v.DateVisite < finMoisPrecedentDateTime);
            var visiteursEvolution = visiteursMoisPrecedent > 0
                ? Math.Round(((visiteursMois - visiteursMoisPrecedent) / (double)visiteursMoisPrecedent) * 100, 1)
                : 0;

            var pagesVisitees = await _context.Visites
                .Where(v => v.DateVisite >= debutMoisDateTime && v.DateVisite < aujourdHui.AddDays(1).Date)
                .GroupBy(v => v.Page ?? "Non identifiée")
                .Select(g => new { Page = g.Key, Visites = g.Count() })
                .OrderByDescending(g => g.Visites)
                .Take(5)
                .ToListAsync();

            var pagesPopulaires = pagesVisitees.Select(page => new PagePopulaireDto
            {
                Page = page.Page,
                Visites = page.Visites,
                Pourcentage = visiteursMois > 0
                    ? Math.Round(page.Visites * 100.0 / visiteursMois, 1)
                    : 0
            }).ToList();

            var visitesCarte = await _context.Visites
                .CountAsync(v => v.DateVisite >= debutMoisDateTime
                    && v.DateVisite < aujourdHui.AddDays(1).Date
                    && v.Page != null
                    && v.Page.ToLower().Contains("carte"));
            var reservationsMois = await _context.Reservations
                .CountAsync(r => r.DateCreation >= debutMoisDateTime);
            var reservationsConfirmeesMois = await _context.Reservations
                .CountAsync(r => r.DateCreation >= debutMoisDateTime && r.Statut == "confirmee");

            var tunnelConversion = new List<EtapeConversionDto>
            {
                new() { Etape = "Visite", Valeur = visiteursMois, Pourcentage = 100 },
                new() { Etape = "Carte", Valeur = visitesCarte, Pourcentage = visiteursMois > 0 ? Math.Round(visitesCarte * 100.0 / visiteursMois, 1) : 0 },
                new() { Etape = "Réservation", Valeur = reservationsMois, Pourcentage = visiteursMois > 0 ? Math.Round(reservationsMois * 100.0 / visiteursMois, 1) : 0 },
                new() { Etape = "Confirmée", Valeur = reservationsConfirmeesMois, Pourcentage = visiteursMois > 0 ? Math.Round(reservationsConfirmeesMois * 100.0 / visiteursMois, 1) : 0 }
            };

            // Trafic journalier (7 derniers jours)
            var traficJournalier = new List<TraficJournalierDto>();
            var joursSemaine = new[] { "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim" };
            for (int i = 6; i >= 0; i--)
            {
                var date = aujourdHui.AddDays(-i);
                var jourIndex = (int)date.DayOfWeek == 0 ? 6 : (int)date.DayOfWeek - 1;
                var dateOnly = DateOnly.FromDateTime(date);

                var reservationsJour = await _context.Reservations
                    .CountAsync(r => r.DateReservation == dateOnly);
                var visitesJour = await _context.Visites
                    .CountAsync(v => v.DateVisite >= date.Date && v.DateVisite < date.Date.AddDays(1));

                traficJournalier.Add(new TraficJournalierDto
                {
                    Jour = joursSemaine[jourIndex],
                    Visiteurs = visitesJour,
                    Reservations = reservationsJour
                });
            }

            var sources = await _context.Visites
                .Where(v => v.DateVisite >= debutMoisDateTime)
                .GroupBy(v => v.Source ?? "Direct")
                .Select(g => new { Nom = g.Key, Nombre = g.Count() })
                .OrderByDescending(g => g.Nombre)
                .ToListAsync();

            var couleursSources = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                ["Google"] = "#4285F4",
                ["Direct"] = "#C4A060",
                ["TripAdvisor"] = "#34A853",
                ["Réseaux sociaux"] = "#E85D75",
                ["Autres"] = "#A3A3A3"
            };

            var sourcesTrafic = sources.Count == 0 || visiteursMois == 0
                ? new List<SourceTraficDto>()
                : sources.Select(source => new SourceTraficDto
                {
                    Nom = source.Nom,
                    Valeur = (int)Math.Round(source.Nombre * 100.0 / visiteursMois),
                    Couleur = couleursSources.TryGetValue(source.Nom, out var couleur)
                        ? couleur
                        : "#8A8471"
                }).ToList();

            // Horaires populaires
            var horairesGroupes = await _context.Reservations
                .GroupBy(r => r.HeureReservation)
                .Select(g => new
                {
                    Heure = g.Key,
                    Reservations = g.Count()
                })
                .OrderByDescending(h => h.Reservations)
                .Take(11)
                .ToListAsync();

            var horairesPopulaires = horairesGroupes
                .OrderBy(h => h.Heure)
                .Select(h => new HorairePopulaireDto
                {
                    Heure = h.Heure.ToString("HH:mm"),
                    Reservations = h.Reservations
                })
                .ToList();

            // Évolution des réservations (30 derniers jours)
            var ilYA30Jours = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30));
            var evolution = await _context.Reservations
                .Where(r => r.DateReservation >= ilYA30Jours)
                .GroupBy(r => r.DateReservation)
                .Select(g => new EvolutionReservationsDto
                {
                    Date = g.Key,
                    NombreReservations = g.Count()
                })
                .OrderBy(e => e.Date)
                .ToListAsync();

            return new StatistiquesDto
            {
                NombreReservations = nombreReservations,
                NombreReservationsEnAttente = nombreReservationsEnAttente,
                NombreUtilisateursInscrits = nombreUtilisateurs,
                NombreAvis = nombreAvis,
                NombreAvisEnAttente = nombreAvisEnAttente,
                NoteMoyenne = noteMoyenne,
                EvolutionReservations = evolution,
                TraficJournalier = traficJournalier,
                SourcesTrafic = sourcesTrafic,
                HorairesPopulaires = horairesPopulaires,
                VisiteursMois = visiteursMois,
                VisiteursEvolution = visiteursEvolution,
                ReservationsEvolution = reservationsEvolution,
                ClientsEvolution = clientsEvolution,
                NoteEvolution = noteEvolution,
                VisitesTotal = visitesTotal
                ,
                PagesPopulaires = pagesPopulaires
                ,
                TunnelConversion = tunnelConversion
            };
        }
    }
}