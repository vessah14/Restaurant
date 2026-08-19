using System.Net;
using System.Net.Mail;
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
            var message = new MailMessage
            {
                From = new MailAddress(_config["Smtp:From"]!, "Les Deux Colombes"),
                Subject = "Réinitialisation de votre mot de passe",
                Body = $"Bonjour {prenom},\n\n" +
                       $"Cliquez sur ce lien pour réinitialiser votre mot de passe (valable 1h) :\n{lienReset}\n\n" +
                       "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.",
                IsBodyHtml = false
            };
            message.To.Add(emailDestinataire);

            using var client = new SmtpClient(_config["Smtp:Host"], int.Parse(_config["Smtp:Port"]!))
            {
                Credentials = new NetworkCredential(_config["Smtp:User"], _config["Smtp:Password"]),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}