using PatientTrackingPlatform.Application.Common.Mappings;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Patients.DTOs
{
    public class PatientDto : IMapFrom<Patient>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string IdentificationNumber { get; set; } = string.Empty;
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
            profile.CreateMap<Patient, PatientDto>();
        }
    }
}