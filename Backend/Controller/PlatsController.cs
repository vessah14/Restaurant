using Backend.Dtos.Menu;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlatsController : ControllerBase
    {
        private readonly IPlatService _platService;

        public PlatsController(IPlatService platService)
        {
            _platService = platService;
        }

        // Route PUBLIQUE — §8, la carte complète groupée par catégorie

        [HttpGet("carte")]
        public async Task<ActionResult<IEnumerable<CategorieMenuDto>>> GetCarte([FromQuery] string langue = "fr")
        {
            var carte = await _platService.GetCarteAsync(langue);
            return Ok(carte);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlatDto>> GetById(long id, [FromQuery] string langue = "fr")
        {
            var plat = await _platService.GetByIdAsync(id, langue);
            return plat is null ? NotFound() : Ok(plat);
        }

        // Routes ADMIN — §21

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlatDto>>> GetAll([FromQuery] string langue = "fr")
        {
            var plats = await _platService.GetAllAsync(langue);
            return Ok(plats);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<PlatDto>> Creer(CreerPlatDto dto)
        {
            try
            {
                var plat = await _platService.CreerAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = plat.Id }, plat);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<PlatDto>> Modifier(long id, ModifierPlatDto dto)
        {
            var plat = await _platService.ModifierAsync(id, dto);
            return plat is null ? NotFound() : Ok(plat);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(long id)
        {
            var succes = await _platService.SupprimerAsync(id);
            return succes ? NoContent() : NotFound();
        }
    }
}