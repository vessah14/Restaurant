using Backend.Dtos.Auth;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UtilisateursController : ControllerBase
    {
        private readonly IUtilisateurService _utilisateurService;

        public UtilisateursController(
            IUtilisateurService utilisateurService)
        {
            _utilisateurService = utilisateurService;
        }

        // GET: api/Utilisateurs
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UtilisateurDto>>> GetAll(
            [FromQuery] bool inclureInactifs = false)
        {
            var utilisateurs =
                await _utilisateurService.GetAllAsync(inclureInactifs);

            return Ok(utilisateurs);
        }

        // GET: api/Utilisateurs/moi
        [HttpGet("moi")]
        [Authorize]
        public async Task<ActionResult<UtilisateurDto>> GetMoi()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var utilisateur = await _utilisateurService.GetByIdAsync(userId);

            if (utilisateur == null)
            {
                return NotFound(new { message = "Utilisateur introuvable." });
            }

            return Ok(utilisateur);
        }

        // GET: api/Utilisateurs/email-existe
        [HttpGet("email-existe")]
        public async Task<ActionResult<bool>> EmailExiste([FromQuery] string email)
        {
            var existe = await _utilisateurService.EmailExisteAsync(email);
            return Ok(existe);
        }

        // PUT: api/Utilisateurs/moi
        [HttpPut("moi")]
        [Authorize]
        public async Task<ActionResult<UtilisateurDto>> ModifierMonProfil(
            ModifierUtilisateurDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var utilisateur = await _utilisateurService.ModifierAsync(userId, dto);

            if (utilisateur == null)
            {
                return NotFound(new { message = "Utilisateur introuvable." });
            }

            return Ok(utilisateur);
        }

        // GET: api/Utilisateurs/1
        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<UtilisateurDto>> GetById(int id)
        {
            var utilisateur =
                await _utilisateurService.GetByIdAsync(id);

            if (utilisateur == null)
            {
                return NotFound(new
                {
                    message = "Utilisateur introuvable."
                });
            }

            return Ok(utilisateur);
        }

        // PUT: api/Utilisateurs/1
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<UtilisateurDto>> Modifier(
            int id,
            ModifierUtilisateurDto dto)
        {
            var utilisateur =
                await _utilisateurService.ModifierAsync(id, dto);

            if (utilisateur == null)
            {
                return NotFound(new
                {
                    message = "Utilisateur introuvable."
                });
            }

            return Ok(utilisateur);
        }

        // PATCH: api/Utilisateurs/1/desactiver
        [HttpPatch("{id:int}/desactiver")]
        [Authorize]
        public async Task<IActionResult> Desactiver(int id)
        {
            Console.WriteLine("====================================");
            Console.WriteLine("DESACTIVATION UTILISATEUR");
            Console.WriteLine($"ID reçu : {id}");
            Console.WriteLine("====================================");

            var utilisateur =
                await _utilisateurService.GetByIdAsync(id);

            if (utilisateur == null)
            {
                Console.WriteLine(
                    $"UTILISATEUR {id} INTROUVABLE EN BASE"
                );

                return NotFound(new
                {
                    message = $"Utilisateur {id} introuvable."
                });
            }

            var resultat =
                await _utilisateurService.DesactiverAsync(id);

            if (!resultat)
            {
                return NotFound(new
                {
                    message = $"Impossible de désactiver l'utilisateur {id}."
                });
            }

            return NoContent();
        }

        // PATCH: api/Utilisateurs/1/reactiver
        [HttpPatch("{id:int}/reactiver")]
        [Authorize]
        public async Task<IActionResult> Reactiver(int id)
        {
            var resultat =
                await _utilisateurService.ReactiverAsync(id);

            if (!resultat)
            {
                return NotFound(new
                {
                    message = "Utilisateur introuvable."
                });
            }

            return NoContent();
        }
    }
}