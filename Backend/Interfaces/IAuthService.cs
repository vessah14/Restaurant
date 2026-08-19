using Backend.Dtos.Auth;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> ConnexionAsync(LoginDto dto);
        Task<LoginResponseDto?> CreerAdminAsync(CreerUtilisateurDto dto);
        Task<LoginResponseDto?> InscriptionAsync(CreerUtilisateurDto dto);
        Task DemanderResetMotDePasseAsync(DemanderResetMotDePasseDto dto);
        Task<bool> ResetMotDePasseAsync(ResetMotDePasseDto dto);
    }
}