namespace PatientTrackingPlatform.Domain.Exceptions
{
    public class PatientTrackingDomainException : Exception
    {
        public PatientTrackingDomainException() { }

        public PatientTrackingDomainException(string message) : base(message) { }

        public PatientTrackingDomainException(string message, Exception innerException) : base(message, innerException) { }
    }
}