using Backend.Dtos.Galerie;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalerieController : ControllerBase
    {
        private readonly IGalerieService _galerieService;

        public GalerieController(IGalerieService galerieService)
        {
            _galerieService = galerieService;
        }

        // Route PUBLIQUE — §9

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GalerieDto>>> GetAll(
            [FromQuery] string langue = "fr",
            [FromQuery] string? categorie = null)
        {
            var images = await _galerieService.GetAllAsync(langue, categorie);
            return Ok(images);
        }

        // Routes ADMIN — §21

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<GalerieDto>> Ajouter(AjouterImageGalerieDto dto)
        {
            try
            {
                var image = await _galerieService.AjouterAsync(dto);
                return CreatedAtAction(nameof(GetAll), image);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(long id)
        {
            var succes = await _galerieService.SupprimerAsync(id);
            return succes ? NoContent() : NotFound();
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("reorganiser")]
        public async Task<IActionResult> Reorganiser(ReorganiserGalerieDto dto)
        {
            await _galerieService.ReorganiserAsync(dto);
            return NoContent();
        }
    }
}