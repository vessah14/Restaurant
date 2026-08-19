using Backend.Dtos.Pages;

namespace Backend.Interfaces
{
    public interface IPageContenuService
    {
        Task<PageContenuDto?> GetBySlugAsync(string slug, string langue);

        Task<IEnumerable<PageContenuDto>> GetAllAsync(string langue);

        Task<PageContenuDto?> ModifierAsync(string slug, ModifierPageContenuDto dto);
    }
}