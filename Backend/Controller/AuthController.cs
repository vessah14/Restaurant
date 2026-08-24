using Backend.Dtos.Auth;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [EnableRateLimiting("LoginPolicy")]
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto dto)
        {
            var resultat = await _authService.ConnexionAsync(dto);
            return resultat is null
                ? Unauthorized(new { message = "Email ou mot de passe incorrect." })
                : Ok(resultat);
        }

        [HttpPost("creer-admin")]
        public async Task<ActionResult<LoginResponseDto>> CreerAdmin(CreerUtilisateurDto dto)
        {
            try
            {
                var resultat = await _authService.CreerAdminAsync(dto);
                return Ok(resultat);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("inscription")]
        public async Task<ActionResult<LoginResponseDto>> Inscription(CreerUtilisateurDto dto)
        {
            try
            {
                var resultat = await _authService.InscriptionAsync(dto);
                return Ok(resultat);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("mot-de-passe-oublie")]
        public async Task<IActionResult> MotDePasseOublie(DemanderResetMotDePasseDto dto)
        {
            await _authService.DemanderResetMotDePasseAsync(dto);
            return Ok(new { message = "Si cet e-mail existe, un lien de réinitialisation a été envoyé." });
        }

        [HttpPost("reset-mot-de-passe")]
        public async Task<IActionResult> ResetMotDePasse(ResetMotDePasseDto dto)
        {
            try
            {
                var succes = await _authService.ResetMotDePasseAsync(dto);
                return succes
                    ? Ok(new { message = "Mot de passe réinitialisé avec succès." })
                    : BadRequest(new { message = "Lien invalide ou expiré." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}