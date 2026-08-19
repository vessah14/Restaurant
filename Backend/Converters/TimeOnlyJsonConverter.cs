using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Backend.Converters
{
    public class TimeOnlyJsonConverter : JsonConverter<TimeOnly>
    {
        public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetString();
            if (string.IsNullOrWhiteSpace(value))
                return default;

            return TimeOnly.TryParseExact(
                value,
                ["HH:mm:ss", "HH:mm", "HH:mm:ss.fff"],
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var time)
                ? time
                : throw new JsonException($"Valeur de temps invalide: '{value}'. Formats acceptés: HH:mm, HH:mm:ss.");
        }

        public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("HH:mm:ss", CultureInfo.InvariantCulture));
        }
    }
}
