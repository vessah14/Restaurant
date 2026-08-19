using Backend.Dtos.Pages;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagesController : ControllerBase
    {
        private readonly IPageContenuService _pageContenuService;

        public PagesController(IPageContenuService pageContenuService)
        {
            _pageContenuService = pageContenuService;
        }

        // Routes PUBLIQUES — le frontend consomme ça pour afficher le contenu

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PageContenuDto>>> GetAll([FromQuery] string langue = "fr")
        {
            var pages = await _pageContenuService.GetAllAsync(langue);
            return Ok(pages);
        }

        [HttpGet("{slug}")]
        public async Task<ActionResult<PageContenuDto>> GetBySlug(string slug, [FromQuery] string langue = "fr")
        {
            var page = await _pageContenuService.GetBySlugAsync(slug, langue);
            return page is null ? NotFound() : Ok(page);
        }

        // Route ADMIN — §21

        [Authorize(Roles = "admin")]
        [HttpPut("{slug}")]
        public async Task<ActionResult<PageContenuDto>> Modifier(string slug, ModifierPageContenuDto dto)
        {
            var page = await _pageContenuService.ModifierAsync(slug, dto);
            return page is null ? NotFound() : Ok(page);
        }
    }
}