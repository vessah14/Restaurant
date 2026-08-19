using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadsController : ControllerBase
    {
        private static readonly string[] ExtensionsAutorisees =
            { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp" };

        private readonly IWebHostEnvironment _env;

        public UploadsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10 Mo max
        public async Task<ActionResult<object>> UploaderImage(IFormFile fichier)
        {
            if (fichier is null || fichier.Length == 0)
                return BadRequest(new { message = "Aucun fichier reçu." });

            var extension = Path.GetExtension(fichier.FileName).ToLowerInvariant();

            if (!ExtensionsAutorisees.Contains(extension))
                return BadRequest(new { message = "Format d'image non supporté. Utilisez JPG, PNG, WEBP, GIF ou BMP." });

            // Dossier de destination : wwwroot/upload
            var dossierUpload = Path.Combine(_env.WebRootPath, "upload");

            if (!Directory.Exists(dossierUpload))
                Directory.CreateDirectory(dossierUpload);

            // Nom unique pour éviter les collisions
            var nomFichier = $"{Guid.NewGuid():N}{extension}";
            var cheminComplet = Path.Combine(dossierUpload, nomFichier);

            using (var stream = new FileStream(cheminComplet, FileMode.Create))
            {
                await fichier.CopyToAsync(stream);
            }

            // URL accessible publiquement : /upload/nom-fichier.ext
            var url = $"/upload/{nomFichier}";

            return Ok(new
            {
                imageUrl = url,
                nomFichier = nomFichier,
                tailleOctets = fichier.Length,
                type = fichier.ContentType
            });
        }
    }
}