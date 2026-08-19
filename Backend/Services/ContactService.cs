using Backend.Data;
using Backend.Dtos.Contact;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ContactService : IContactService
    {
        private readonly RestaurantDbContext _context;
        private readonly INotificationService _notificationService;

        public ContactService(RestaurantDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<ContactMessageDto> CreerAsync(CreerContactMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nom))
                throw new InvalidOperationException("Le nom est obligatoire.");

            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains('@'))
                throw new InvalidOperationException("L'email est invalide.");

            if (string.IsNullOrWhiteSpace(dto.Sujet))
                throw new InvalidOperationException("Le sujet est obligatoire.");

            if (string.IsNullOrWhiteSpace(dto.Message))
                throw new InvalidOperationException("Le message est obligatoire.");

            var message = new ContactMessage
            {
                Nom = dto.Nom,
                Email = dto.Email,
                Telephone = dto.Telephone,
                Sujet = dto.Sujet,
                Message = dto.Message,
                Statut = "nouveau",
                DateCreation = DateTime.UtcNow
            };

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();

            // Créer une notification pour l'admin
            await _notificationService.CreerAsync(new Backend.Dtos.Notification.CreerNotificationDto
            {
                Type = "message",
                Titre = "Nouveau message de contact",
                Message = $"{message.Nom} ({message.Email}) a envoyé un message : {message.Sujet}",
                TypeEntite = "contact_message",
                EntiteId = message.Id,
                RoleCible = "admin"
            });

            return MapVersDto(message);
        }

        public async Task<IEnumerable<ContactMessageDto>> GetAllAsync(string? statut = null)
        {
            var query = _context.ContactMessages.AsQueryable();

            if (!string.IsNullOrEmpty(statut))
                query = query.Where(m => m.Statut == statut);

            return await query
                .OrderByDescending(m => m.DateCreation)
                .Select(m => MapVersDto(m))
                .ToListAsync();
        }

        public async Task<ContactMessageDto?> GetByIdAsync(long id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            return message == null ? null : MapVersDto(message);
        }

        public async Task<ContactMessageDto?> MarquerCommeLuAsync(long id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null)
                return null;

            message.Statut = "lu";
            message.DateLecture = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapVersDto(message);
        }

        public async Task<ContactMessageDto?> RepondreAsync(long id, RepondreContactMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Reponse))
                throw new InvalidOperationException("La réponse est obligatoire.");

            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null)
                return null;

            message.Statut = "repondu";
            message.Reponse = dto.Reponse;
            message.DateReponse = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapVersDto(message);
        }

        public async Task<bool> SupprimerAsync(long id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null)
                return false;

            _context.ContactMessages.Remove(message);
            await _context.SaveChangesAsync();

            return true;
        }

        private static ContactMessageDto MapVersDto(ContactMessage m) => new()
        {
            Id = m.Id,
            Nom = m.Nom,
            Email = m.Email,
            Telephone = m.Telephone,
            Sujet = m.Sujet,
            Message = m.Message,
            Statut = m.Statut,
            DateCreation = m.DateCreation,
            DateLecture = m.DateLecture,
            DateReponse = m.DateReponse,
            Reponse = m.Reponse
        };
    }
}
