using Backend.Dtos.Faq;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaqController : ControllerBase
    {
        private readonly IFaqService _faqService;

        public FaqController(IFaqService faqService)
        {
            _faqService = faqService;
        }

        // Route PUBLIQUE — Récupérer toutes les FAQs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FaqDto>>> GetAll([FromQuery] string langue = "fr")
        {
            var faqs = await _faqService.GetAllAsync(langue);
            return Ok(faqs);
        }

        // Routes ADMIN — §21

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<FaqDto>> Creer(CreerFaqDto dto)
        {
            var faq = await _faqService.CreerAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { }, faq);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<FaqDto>> Modifier(long id, ModifierFaqDto dto)
        {
            var faq = await _faqService.ModifierAsync(id, dto);
            return faq is null ? NotFound() : Ok(faq);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(long id)
        {
            var succes = await _faqService.SupprimerAsync(id);
            return succes ? NoContent() : NotFound();
        }
    }
}
