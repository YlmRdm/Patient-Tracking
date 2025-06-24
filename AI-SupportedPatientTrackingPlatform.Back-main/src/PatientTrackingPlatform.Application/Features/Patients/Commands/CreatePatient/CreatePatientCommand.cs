using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;
using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Patients.Commands.CreatePatient
{
    [Authorize(Roles = "Admin,Doctor")]
    public class CreatePatientCommand : IRequest<Guid>
    {
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

        // Contact Information
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }

        public static CreatePatientCommand FromDto(CreateUpdatePatientDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto), "Hasta bilgileri boş olamaz");
            }
            return new CreatePatientCommand
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                IdentificationNumber = dto.IdentificationNumber,
                MedicalHistory = dto.MedicalHistory,
                Street = dto.Street,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                Country = dto.Country,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                EmergencyContactName = dto.EmergencyContactName,
                EmergencyContactPhone = dto.EmergencyContactPhone
            };
        }
    }
}