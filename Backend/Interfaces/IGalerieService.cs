using Backend.Dtos.Galerie;

namespace Backend.Interfaces
{
    public interface IGalerieService
    {
        Task<IEnumerable<GalerieDto>> GetAllAsync(string langue, string? categorie = null);

        Task<GalerieDto> AjouterAsync(AjouterImageGalerieDto dto);

        Task<bool> SupprimerAsync(long id);

        Task ReorganiserAsync(ReorganiserGalerieDto dto);
    }
}