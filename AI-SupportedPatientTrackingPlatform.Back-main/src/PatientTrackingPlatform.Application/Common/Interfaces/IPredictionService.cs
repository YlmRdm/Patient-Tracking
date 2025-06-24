namespace PatientTrackingPlatform.Application.Common.Interfaces
{
    public interface IPredictionService
    {
        Task<object> GetPredictionAsync(Guid patientId);
    }
}