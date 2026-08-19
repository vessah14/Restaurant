using Backend.Dtos.ReseauSocial;

namespace Backend.Interfaces
{
    public interface IReseauSocialService
    {
        Task<IEnumerable<ReseauSocialDto>> GetAllAsync();

        Task<ReseauSocialDto> CreerAsync(CreerReseauSocialDto dto);

        Task<ReseauSocialDto?> ModifierAsync(int id, ModifierReseauSocialDto dto);

        Task<bool> SupprimerAsync(int id);
    }
}