using FluentValidation;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.Patients.Commands.UpdatePatient
{
    public class UpdatePatientCommandValidator : AbstractValidator<UpdatePatientCommand>
    {
        private readonly IPatientRepository _patientRepository;

        public UpdatePatientCommandValidator(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;

            RuleFor(v => v.Id)
                .NotEmpty().WithMessage("Patient ID is required.");

            RuleFor(v => v.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

            RuleFor(v => v.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");

            RuleFor(v => v.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth is required.")
                .LessThan(DateTime.Now).WithMessage("Date of birth must be in the past.");

            RuleFor(v => v.IdentificationNumber)
                .NotEmpty().WithMessage("Identification number is required.")
                .MaximumLength(50).WithMessage("Identification number must not exceed 50 characters.")
                .MustAsync(BeUniqueIdentificationNumber).WithMessage("The specified identification number already exists.");

            // Address validation
            RuleFor(v => v.Street)
                .NotEmpty().WithMessage("Street is required.")
                .MaximumLength(100).WithMessage("Street must not exceed 100 characters.");

            RuleFor(v => v.City)
                .NotEmpty().WithMessage("City is required.")
                .MaximumLength(100).WithMessage("City must not exceed 100 characters.");

            RuleFor(v => v.State)
                .NotEmpty().WithMessage("State is required.")
                .MaximumLength(100).WithMessage("State must not exceed 100 characters.");

            RuleFor(v => v.ZipCode)
                .NotEmpty().WithMessage("Zip code is required.")
                .MaximumLength(20).WithMessage("Zip code must not exceed 20 characters.");

            RuleFor(v => v.Country)
                .NotEmpty().WithMessage("Country is required.")
                .MaximumLength(100).WithMessage("Country must not exceed 100 characters.");

            // Contact validation
            RuleFor(v => v.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required.")
                .MaximumLength(30).WithMessage("Phone number must not exceed 30 characters.");

            RuleFor(v => v.Email)
                .EmailAddress().WithMessage("Email is not valid.")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters.")
                .When(v => !string.IsNullOrEmpty(v.Email), ApplyConditionTo.CurrentValidator);

            RuleFor(v => v.EmergencyContactPhone)
                .MaximumLength(30).WithMessage("Emergency contact phone must not exceed 30 characters.")
                .When(v => !string.IsNullOrEmpty(v.EmergencyContactPhone), ApplyConditionTo.CurrentValidator);

            RuleFor(v => v.EmergencyContactName)
                .MaximumLength(100).WithMessage("Emergency contact name must not exceed 100 characters.")
                .When(v => !string.IsNullOrEmpty(v.EmergencyContactName), ApplyConditionTo.CurrentValidator);
        }

        public async Task<bool> BeUniqueIdentificationNumber(UpdatePatientCommand command, string identificationNumber, CancellationToken cancellationToken)
        {
            var existingPatient = await _patientRepository.GetByIdentificationNumberAsync(identificationNumber);
            return existingPatient == null || existingPatient.Id == command.Id;
        }
    }
}