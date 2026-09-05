using Backend.Data;
using Backend.Dtos.Auth;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly RestaurantDbContext _context;

        public AuthController(IAuthService authService, RestaurantDbContext context)
        {
            _authService = authService;
            _context = context;
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

        // Endpoint temporaire pour lister les utilisateurs (debug)
        [HttpGet("list-users")]
        public async Task<ActionResult> ListUsers()
        {
            var users = await _context.Utilisateurs
                .Select(u => new { u.Id, u.Nom, u.Email, u.Role, u.Actif })
                .ToListAsync();
            return Ok(users);
        }

        // Endpoint temporaire pour créer l'admin par défaut
        [HttpPost("create-default-admin")]
        public async Task<ActionResult<LoginResponseDto>> CreateDefaultAdmin()
        {
            try
            {
                // Supprimer l'admin existant s'il y en a un
                var existingAdmin = await _context.Utilisateurs
                    .FirstOrDefaultAsync(u => u.Role == "admin");
                
                if (existingAdmin != null)
                {
                    _context.Utilisateurs.Remove(existingAdmin);
                    await _context.SaveChangesAsync();
                }

                var dto = new CreerUtilisateurDto
                {
                    Nom = "ADMIN",
                    Prenom = "Admin",
                    Email = "Admin28@gmail.com",
                    MotDePasse = "Admin123",
                    Telephone = "673054260"
                };
                var resultat = await _authService.CreerAdminAsync(dto);
                return Ok(resultat);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}