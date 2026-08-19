using Backend.Dtos.Faq;

namespace Backend.Interfaces
{
    public interface IFaqService
    {
        Task<IEnumerable<FaqDto>> GetAllAsync(string langue);

        Task<FaqDto> CreerAsync(CreerFaqDto dto);

        Task<FaqDto?> ModifierAsync(long id, ModifierFaqDto dto);

        Task<bool> SupprimerAsync(long id);
    }
}