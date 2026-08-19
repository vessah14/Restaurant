using Backend.Dtos.Menu;

namespace Backend.Interfaces
{
    public interface IPlatService
    {
        Task<IEnumerable<CategorieMenuDto>> GetCarteAsync(string langue);

        Task<IEnumerable<PlatDto>> GetAllAsync(string langue);

        Task<PlatDto?> GetByIdAsync(long id, string langue);

        Task<PlatDto> CreerAsync(CreerPlatDto dto);

        Task<PlatDto?> ModifierAsync(long id, ModifierPlatDto dto);

        Task<bool> SupprimerAsync(long id);
    }
}