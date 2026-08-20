namespace Backend.Interfaces
{
    public interface IEmailService
    {
        Task EnvoyerEmailResetMotDePasseAsync(string emailDestinataire, string prenom, string lienReset);
        Task EnvoyerEmailReponseContactAsync(string emailDestinataire, string nomDestinataire, string sujet, string reponse);
    }
}