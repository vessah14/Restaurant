using System.Net.Http.Json;
using System.Net.Http.Headers;
using Backend.Interfaces;

namespace Backend.Services
{
    public class TranslationService : ITranslationService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public TranslationService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient("DeepL");
        }

        public async Task<string> TraduireAsync(string texte, string langueCible)
        {
            if (string.IsNullOrWhiteSpace(texte)) return string.Empty;

            var endpoint = _configuration["DeepL:Endpoint"]?.TrimEnd('/');
            var key = _configuration["DeepL:ApiKey"];

            if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(key))
                return texte;

            using var request = new HttpRequestMessage(HttpMethod.Post, $"{endpoint}/v2/translate");
            request.Headers.Authorization = new AuthenticationHeaderValue("DeepL-Auth-Key", key);
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["text"] = texte,
                ["target_lang"] = langueCible.ToUpperInvariant()
            });

            using var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return texte;

            var result = await response.Content.ReadFromJsonAsync<TranslationResponse>();
            return result?.Translations.FirstOrDefault()?.Text ?? texte;
        }

        private sealed class TranslationResponse
        {
            public Translation[] Translations { get; set; } = Array.Empty<Translation>();
        }

        private sealed class Translation
        {
            public string Text { get; set; } = string.Empty;
        }
    }
}
