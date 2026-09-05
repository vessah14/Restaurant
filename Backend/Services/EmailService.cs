using Backend.Interfaces;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task EnvoyerEmailResetMotDePasseAsync(string emailDestinataire, string prenom, string lienReset)
        {
            await EnvoyerAsync(
                emailDestinataire,
                "Réinitialisation de votre mot de passe",
                $"Bonjour {prenom},\n\n" +
                $"Cliquez sur ce lien pour réinitialiser votre mot de passe (valable 1h) :\n{lienReset}\n\n" +
                "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.");
        }

        public async Task EnvoyerEmailReponseContactAsync(string emailDestinataire, string nomDestinataire, string sujet, string reponse)
        {
            await EnvoyerAsync(
                emailDestinataire,
                $"Réponse à votre message : {sujet}",
                $"Bonjour {nomDestinataire},\n\n" +
                $"Voici la réponse de notre équipe à votre message concernant « {sujet} » :\n\n" +
                reponse + "\n\n" +
                "Cordialement,\nLes Deux Colombes");
        }

        private Task EnvoyerAsync(string emailDestinataire, string sujet, string contenu)
        {
            var emailProviderConfigured = !string.IsNullOrWhiteSpace(_config["Email:Provider"]) ||
                !string.IsNullOrWhiteSpace(_config["Smtp:Host"]);

            if (!emailProviderConfigured)
            {
                return Task.CompletedTask;
            }

            return Task.CompletedTask;
        }
    }
}