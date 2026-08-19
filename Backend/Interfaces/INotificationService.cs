using Backend.Dtos.Notification;

namespace Backend.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationDto> CreerAsync(CreerNotificationDto dto);
        Task<IEnumerable<NotificationDto>> GetAllAsync(bool? estLu = null, string? type = null);
        Task<NotificationDto?> GetByIdAsync(long id);
        Task<NotificationDto?> MarquerCommeLuAsync(long id);
        Task<int> GetNombreNonLusAsync(string? roleCible = null);
        Task<bool> MarquerTousCommeLusAsync(string? roleCible = null);
        Task<bool> SupprimerAsync(long id);
    }
}
