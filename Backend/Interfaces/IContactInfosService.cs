using Backend.Dtos.Contact;

namespace Backend.Interfaces
{
    public interface IContactInfosService
    {
        Task<ContactInfosDto> GetAsync(string langue);

        Task<ContactInfosDto> ModifierAsync(ModifierContactInfosDto dto);
    }
}