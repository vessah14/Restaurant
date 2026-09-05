namespace Backend.Interfaces
{
    public interface ICloudinaryService
    {
        Task<(string Url, string PublicId)> UploadImageAsync(IFormFile file, string dossier = "galerie");
        Task<bool> SupprimerImageAsync(string publicId);
    }
}