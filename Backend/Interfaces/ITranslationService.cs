namespace Backend.Interfaces
{
    public interface ITranslationService
    {
        Task<string> TraduireAsync(string texte, string langueCible);
    }
}
