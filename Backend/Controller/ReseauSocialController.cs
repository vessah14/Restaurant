using Backend.Dtos.ReseauSocial;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReseauxSociauxController : ControllerBase
    {
        private readonly IReseauSocialService _reseauSocialService;

        public ReseauxSociauxController(IReseauSocialService reseauSocialService)
        {
            _reseauSocialService = reseauSocialService;
        }

        // Route PUBLIQUE — §20

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReseauSocialDto>>> GetAll()
        {
            var reseaux = await _reseauSocialService.GetAllAsync();
            return Ok(reseaux);
        }

        // Routes ADMIN

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<ReseauSocialDto>> Creer(CreerReseauSocialDto dto)
        {
            var reseau = await _reseauSocialService.CreerAsync(dto);
            return CreatedAtAction(nameof(GetAll), reseau);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ReseauSocialDto>> Modifier(int id, ModifierReseauSocialDto dto)
        {
            var reseau = await _reseauSocialService.ModifierAsync(id, dto);
            return reseau is null ? NotFound() : Ok(reseau);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(int id)
        {
            var succes = await _reseauSocialService.SupprimerAsync(id);
            return succes ? NoContent() : NotFound();
        }
    }
}