using PatientTrackingPlatform.Domain.Common;
using PatientTrackingPlatform.Domain.Exceptions;

namespace PatientTrackingPlatform.Domain.ValueObjects
{
    public class ContactInformation : ValueObject
    {
        public string PhoneNumber { get; private set; }
        public string? Email { get; private set; }
        public string? EmergencyContactName { get; private set; }
        public string? EmergencyContactPhone { get; private set; }

      
        private ContactInformation() { }

        public ContactInformation(string phoneNumber, string? email = null, string? emergencyContactName = null, string? emergencyContactPhone = null)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                throw new PatientTrackingDomainException("PhoneNumber cannot be empty");
                
            PhoneNumber = phoneNumber;
            Email = email;
            EmergencyContactName = emergencyContactName;
            EmergencyContactPhone = emergencyContactPhone;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return PhoneNumber;
            if (Email != null) yield return Email;
            if (EmergencyContactName != null) yield return EmergencyContactName;
            if (EmergencyContactPhone != null) yield return EmergencyContactPhone;
        }
    }
}