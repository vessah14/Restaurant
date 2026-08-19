using Backend.Dtos.Auth;

namespace Backend.Interfaces
{
    public interface IUtilisateurService
    {
        Task<UtilisateurDto?> GetByIdAsync(int id);

        Task<UtilisateurDto?> GetByEmailAsync(string email);

        Task<IEnumerable<UtilisateurDto>> GetAllAsync(bool inclureInactifs = false);

        Task<UtilisateurDto> CreerAsync(CreerUtilisateurDto dto);

        Task<UtilisateurDto?> ModifierAsync(int id, ModifierUtilisateurDto dto);

        Task<bool> DesactiverAsync(int id);

        Task<bool> ReactiverAsync(int id);

        Task<bool> EmailExisteAsync(string email);
    }
}