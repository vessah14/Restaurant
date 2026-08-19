using Backend.Dtos.Contact;

namespace Backend.Interfaces
{
    public interface IContactService
    {
        Task<ContactMessageDto> CreerAsync(CreerContactMessageDto dto);
        Task<IEnumerable<ContactMessageDto>> GetAllAsync(string? statut = null);
        Task<ContactMessageDto?> GetByIdAsync(long id);
        Task<ContactMessageDto?> MarquerCommeLuAsync(long id);
        Task<ContactMessageDto?> RepondreAsync(long id, RepondreContactMessageDto dto);
        Task<bool> SupprimerAsync(long id);
    }
}
