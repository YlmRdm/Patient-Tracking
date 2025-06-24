using PatientTrackingPlatform.Application.Common.Interfaces;

namespace PatientTrackingPlatform.Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.UtcNow;
    }
}