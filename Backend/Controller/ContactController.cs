using Backend.Dtos.Contact;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactInfosController : ControllerBase
    {
        private readonly IContactInfosService _contactInfosService;

        public ContactInfosController(IContactInfosService contactInfosService)
        {
            _contactInfosService = contactInfosService;
        }

        // Route PUBLIQUE — §14

        [HttpGet]
        public async Task<ActionResult<ContactInfosDto>> Get([FromQuery] string langue = "fr")
        {
            var infos = await _contactInfosService.GetAsync(langue);
            return Ok(infos);
        }

        // Route ADMIN — §21

        [Authorize(Roles = "admin")]
        [HttpPut]
        public async Task<ActionResult<ContactInfosDto>> Modifier(ModifierContactInfosDto dto)
        {
            var infos = await _contactInfosService.ModifierAsync(dto);
            return Ok(infos);
        }
    }
}