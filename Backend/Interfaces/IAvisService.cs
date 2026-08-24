using Backend.Dtos.Avis;

namespace Backend.Interfaces
{
    public interface IAvisService
    {
        Task<IEnumerable<AvisDto>> GetPubliesAsync(string langue);

        Task<IEnumerable<AvisDto>> GetAllAsync(string? statut = null);

        Task<AvisDto?> GetByIdAsync(long id);

        Task<AvisDto> CreerAsync(CreerAvisDto dto, int? utilisateurId);

        Task<AvisDto?> ModererAsync(long id, ModererAvisDto dto);

        Task<bool> SupprimerAsync(long id);
    }
}