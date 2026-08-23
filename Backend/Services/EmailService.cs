using Backend.Interfaces;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public EmailService(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClient = httpClientFactory.CreateClient("SendGrid");
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

        private async Task EnvoyerAsync(string emailDestinataire, string sujet, string contenu)
        {
            var apiKey = _config["SendGrid:ApiKey"];
            var emailExpediteur = _config["SendGrid:From"];
            var nomExpediteur = _config["SendGrid:FromName"] ?? "Les Deux Colombes";

            if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(emailExpediteur))
                throw new InvalidOperationException("La configuration SendGrid est incomplète.");

            using var request = new HttpRequestMessage(HttpMethod.Post, "mail/send");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            request.Content = JsonContent.Create(new
            {
                personalizations = new[]
                {
                    new { to = new[] { new { email = emailDestinataire } } }
                },
                from = new { email = emailExpediteur, name = nomExpediteur },
                subject = sujet,
                content = new[] { new { type = "text/plain", value = contenu } }
            });

            using var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var details = await response.Content.ReadAsStringAsync();
                throw new InvalidOperationException($"SendGrid a refusé l'envoi : {details}");
            }
        }
    }
}