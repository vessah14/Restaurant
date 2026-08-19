using Backend.Data;
using Backend.Dtos.Notification;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly RestaurantDbContext _context;

        public NotificationService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<NotificationDto> CreerAsync(CreerNotificationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Type))
                throw new InvalidOperationException("Le type de notification est obligatoire.");

            if (string.IsNullOrWhiteSpace(dto.Titre))
                throw new InvalidOperationException("Le titre est obligatoire.");

            if (string.IsNullOrWhiteSpace(dto.Message))
                throw new InvalidOperationException("Le message est obligatoire.");

            var notification = new Notification
            {
                Type = dto.Type,
                Titre = dto.Titre,
                Message = dto.Message,
                TypeEntite = dto.TypeEntite,
                EntiteId = dto.EntiteId,
                EstLu = false,
                DateCreation = DateTime.UtcNow,
                RoleCible = dto.RoleCible ?? "admin"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return MapVersDto(notification);
        }

        public async Task<IEnumerable<NotificationDto>> GetAllAsync(bool? estLu = null, string? type = null)
        {
            var query = _context.Notifications.AsQueryable();

            if (estLu.HasValue)
                query = query.Where(n => n.EstLu == estLu.Value);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(n => n.Type == type);

            return await query
                .OrderByDescending(n => n.DateCreation)
                .Select(n => MapVersDto(n))
                .ToListAsync();
        }

        public async Task<NotificationDto?> GetByIdAsync(long id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            return notification == null ? null : MapVersDto(notification);
        }

        public async Task<NotificationDto?> MarquerCommeLuAsync(long id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return null;

            notification.EstLu = true;
            notification.DateLecture = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapVersDto(notification);
        }

        public async Task<int> GetNombreNonLusAsync(string? roleCible = null)
        {
            var query = _context.Notifications.Where(n => !n.EstLu);

            if (!string.IsNullOrEmpty(roleCible))
                query = query.Where(n => n.RoleCible == roleCible);

            return await query.CountAsync();
        }

        public async Task<bool> MarquerTousCommeLusAsync(string? roleCible = null)
        {
            var query = _context.Notifications.Where(n => !n.EstLu);

            if (!string.IsNullOrEmpty(roleCible))
                query = query.Where(n => n.RoleCible == roleCible);

            var notifications = await query.ToListAsync();

            foreach (var notification in notifications)
            {
                notification.EstLu = true;
                notification.DateLecture = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SupprimerAsync(long id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return true;
        }

        private static NotificationDto MapVersDto(Notification n) => new()
        {
            Id = n.Id,
            Type = n.Type,
            Titre = n.Titre,
            Message = n.Message,
            TypeEntite = n.TypeEntite,
            EntiteId = n.EntiteId,
            EstLu = n.EstLu,
            DateCreation = n.DateCreation,
            DateLecture = n.DateLecture,
            RoleCible = n.RoleCible
        };
    }
}
