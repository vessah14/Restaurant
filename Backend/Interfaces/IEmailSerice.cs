namespace Backend.Interfaces
{
    public interface IEmailService
    {
        Task EnvoyerEmailResetMotDePasseAsync(string emailDestinataire, string prenom, string lienReset);
    }
}