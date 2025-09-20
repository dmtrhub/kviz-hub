using Microsoft.Extensions.Configuration;

namespace KvizHub.Application.Extensions;

public static class ConfigurationExtensions
{
    public static T GetValue<T>(this IConfiguration configuration, string key, T defaultValue = default)
    {
        var value = configuration[key];
        if (string.IsNullOrEmpty(value))
            return defaultValue;

        try
        {
            return (T)Convert.ChangeType(value, typeof(T));
        }
        catch
        {
            return defaultValue;
        }
    }
}