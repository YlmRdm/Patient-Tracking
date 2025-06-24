using PatientTrackingPlatform.Application.Common.Mappings;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Patients.DTOs
{
    public class PatientDetailDto : IMapFrom<Patient>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string IdentificationNumber { get; set; } = string.Empty;
        public AddressDto Address { get; set; } = null!;
        public ContactInformationDto ContactInformation { get; set; } = null!;
        public string? MedicalHistory { get; set; }
        public List<PatientNoteDto> Notes { get; set; } = new List<PatientNoteDto>();
        public string FullName => $"{FirstName} {LastName}";
        public int Age => CalculateAge(DateOfBirth);
        public DateTime Created { get; set; }
        public DateTime? LastModified { get; set; }

        private int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }

        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<Patient, PatientDetailDto>();
        }
    }

    public class AddressDto : IMapFrom<Domain.ValueObjects.Address>
    {
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string FullAddress => $"{Street}, {City}, {State} {ZipCode}, {Country}";

        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<Domain.ValueObjects.Address, AddressDto>();
        }
    }

    public class ContactInformationDto : IMapFrom<Domain.ValueObjects.ContactInformation>
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }

        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<Domain.ValueObjects.ContactInformation, ContactInformationDto>();
        }
    }
}
