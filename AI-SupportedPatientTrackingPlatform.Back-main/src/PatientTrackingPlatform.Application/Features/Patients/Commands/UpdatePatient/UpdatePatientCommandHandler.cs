using MediatR;
using PatientTrackingPlatform.Application.Common.Exceptions;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Domain.Repositories;
using PatientTrackingPlatform.Domain.ValueObjects;

namespace PatientTrackingPlatform.Application.Features.Patients.Commands.UpdatePatient
{
    public class UpdatePatientCommandHandler : IRequestHandler<UpdatePatientCommand, bool>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdatePatientCommandHandler(
            IPatientRepository patientRepository,
            IUnitOfWork unitOfWork)
        {
            _patientRepository = patientRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
        {
            var patient = await _patientRepository.GetByIdAsync(request.Id);

            if (patient == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.Patient), request.Id);
            }
            var dateOfBirthUtc = DateTime.SpecifyKind(request.DateOfBirth, DateTimeKind.Utc);
            patient.UpdatePersonalInformation(
                request.FirstName,
                request.LastName,
                dateOfBirthUtc,
                request.Gender);

            patient.UpdateMedicalHistory(request.MedicalHistory);

            var address = new Address(
                request.Street,
                request.City,
                request.State,
                request.ZipCode,
                request.Country);

            patient.UpdateAddress(address);

            var contactInfo = new ContactInformation(
                request.PhoneNumber,
                request.Email,
                request.EmergencyContactName,
                request.EmergencyContactPhone);

            patient.UpdateContactInformation(contactInfo);

            await _patientRepository.UpdateAsync(patient);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}