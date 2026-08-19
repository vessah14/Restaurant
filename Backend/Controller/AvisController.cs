using Backend.Dtos.Avis;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvisController : ControllerBase
    {
        private readonly IAvisService _avisService;

        public AvisController(IAvisService avisService)
        {
            _avisService = avisService;
        }

        // Routes PUBLIQUES

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AvisDto>>> GetPublies()
        {
            var avis = await _avisService.GetPubliesAsync();
            return Ok(avis);
        }

        [HttpPost]
        public async Task<ActionResult<AvisDto>> Creer(CreerAvisDto dto)
        {
            int? utilisateurId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                utilisateurId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            }

            try
            {
                var avis = await _avisService.CreerAsync(dto, utilisateurId);
                return CreatedAtAction(nameof(GetPublies), avis);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Routes ADMIN

        [Authorize(Roles = "admin")]
        [HttpGet("tous")]
        public async Task<ActionResult<IEnumerable<AvisDto>>> GetAll([FromQuery] string? statut = null)
        {
            var avis = await _avisService.GetAllAsync(statut);
            return Ok(avis);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<AvisDto>> GetById(long id)
        {
            var avis = await _avisService.GetByIdAsync(id);
            return avis is null ? NotFound() : Ok(avis);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("{id}/statut")]
        public async Task<ActionResult<AvisDto>> ModererStatut(long id, ModererAvisDto dto)
        {
            try
            {
                var avis = await _avisService.ModererAsync(id, dto);
                return avis is null ? NotFound() : Ok(avis);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}