using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Patients.DTOs
{
    public class CreateUpdatePatientDto
    {
        // Personal 
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string IdentificationNumber { get; set; } = string.Empty;
        public string? MedicalHistory { get; set; }

        // Address
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;

        // Contact 
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
    }
}