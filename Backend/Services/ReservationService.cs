using Backend.Data;
using Backend.Dtos.Reservation;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ReservationService : IReservationService
    {
        private readonly RestaurantDbContext _context;
        private readonly INotificationService _notificationService;

        public ReservationService(RestaurantDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<ReservationDto> CreerAsync(CreerReservationDto dto, int? utilisateurId)
        {
            if (string.IsNullOrWhiteSpace(dto.Nom))
                throw new InvalidOperationException("Le nom est obligatoire.");

            if (string.IsNullOrWhiteSpace(dto.Prenom))
                throw new InvalidOperationException("Le prénom est obligatoire.");

            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains('@'))
                throw new InvalidOperationException("L’email est invalide.");

            if (string.IsNullOrWhiteSpace(dto.Telephone))
                throw new InvalidOperationException("Le téléphone est obligatoire.");

            if (dto.NombrePersonnes < 1 || dto.NombrePersonnes > 20)
                throw new InvalidOperationException("Le nombre de personnes doit être compris entre 1 et 20.");

            if (dto.DateReservation < DateOnly.FromDateTime(DateTime.UtcNow))
                throw new InvalidOperationException("La date de réservation ne peut pas être dans le passé.");

            if (dto.HeureReservation < TimeOnly.FromTimeSpan(TimeSpan.FromHours(11)) || dto.HeureReservation > TimeOnly.FromTimeSpan(TimeSpan.FromHours(22)))
                throw new InvalidOperationException("L’heure de réservation doit être comprise entre 11:00 et 22:00.");

            var reservation = new Reservation
            {
                UtilisateurId = utilisateurId,
                Nom = dto.Nom,
                Prenom = dto.Prenom,
                Email = dto.Email,
                Telephone = dto.Telephone,
                NombrePersonnes = dto.NombrePersonnes,
                DateReservation = dto.DateReservation,
                HeureReservation = dto.HeureReservation,
                Message = dto.Message,
                Statut = "en_attente",
                DateCreation = DateTime.UtcNow
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // Créer une notification pour l'admin
            await _notificationService.CreerAsync(new Backend.Dtos.Notification.CreerNotificationDto
            {
                Type = "reservation",
                Titre = "Nouvelle réservation",
                Message = $"{reservation.Prenom} {reservation.Nom} a réservé pour {reservation.NombrePersonnes} personne(s) le {reservation.DateReservation:dd/MM/yyyy} à {reservation.HeureReservation:HH\\:mm}.",
                TypeEntite = "reservation",
                EntiteId = reservation.Id,
                RoleCible = "admin"
            });

            return MapVersDto(reservation);
        }

        public async Task<IEnumerable<ReservationDto>> GetMesReservationsAsync(int utilisateurId)
        {
            return await _context.Reservations
                .Where(r => r.UtilisateurId == utilisateurId)
                .OrderByDescending(r => r.DateReservation)
                .Select(r => MapVersDto(r))
                .ToListAsync();
        }

        public async Task<IEnumerable<ReservationDto>> GetAllAsync(string? statut = null)
        {
            var query = _context.Reservations.AsQueryable();

            if (!string.IsNullOrEmpty(statut))
                query = query.Where(r => r.Statut == statut);

            return await query
                .OrderByDescending(r => r.DateReservation)
                .ThenBy(r => r.HeureReservation)
                .Select(r => MapVersDto(r))
                .ToListAsync();
        }

        public async Task<ReservationDto?> GetByIdAsync(long id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            return reservation is null ? null : MapVersDto(reservation);
        }

        public async Task<ReservationDto?> ModifierStatutAsync(long id, ModifierStatutReservationDto dto)
        {
            var statutsValides = new[] { "en_attente", "confirmee", "annulee", "terminee" };
            if (!statutsValides.Contains(dto.Statut))
                throw new InvalidOperationException("Statut invalide.");

            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation is null) return null;

            reservation.Statut = dto.Statut;
            reservation.DateModification = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapVersDto(reservation);
        }

        private static ReservationDto MapVersDto(Reservation r) => new()
        {
            Id = r.Id,
            Nom = r.Nom,
            Prenom = r.Prenom,
            Email = r.Email,
            Telephone = r.Telephone,
            NombrePersonnes = r.NombrePersonnes,
            DateReservation = r.DateReservation,
            HeureReservation = r.HeureReservation,
            Message = r.Message,
            Statut = r.Statut,
            DateCreation = r.DateCreation
        };
    }
}