public static class DateTimeExtensions
{
    public static DateTime EnsureUtc(this DateTime dateTime)
    {
        return dateTime.Kind == DateTimeKind.Unspecified 
            ? DateTime.SpecifyKind(dateTime, DateTimeKind.Utc)
            : dateTime.ToUniversalTime();
    }
}