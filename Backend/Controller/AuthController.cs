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
                ? Unauthorized(new { message = "Nom ou mot de passe incorrect." })
                : Ok(resultat);
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
    }
}
