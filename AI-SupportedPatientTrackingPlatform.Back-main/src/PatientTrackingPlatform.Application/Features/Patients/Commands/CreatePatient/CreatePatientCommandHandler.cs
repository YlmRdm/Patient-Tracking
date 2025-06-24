using MediatR;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;
using PatientTrackingPlatform.Domain.ValueObjects;

namespace PatientTrackingPlatform.Application.Features.Patients.Commands.CreatePatient
{
    public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, Guid>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public CreatePatientCommandHandler(
            IPatientRepository patientRepository,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _patientRepository = patientRepository;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
        {
            var dateOfBirthUtc = DateTime.SpecifyKind(request.DateOfBirth, DateTimeKind.Utc);
            var address = new Address(
                request.Street,
                request.City,
                request.State,
                request.ZipCode,
                request.Country);

            var contactInfo = new ContactInformation(
                request.PhoneNumber,
                request.Email,
                request.EmergencyContactName,
                request.EmergencyContactPhone);

            var patient = new Patient(
                request.FirstName,
                request.LastName,
                dateOfBirthUtc,
                request.Gender,
                request.IdentificationNumber,
                address,
                contactInfo,
                request.MedicalHistory);

            var id = await _patientRepository.AddAsync(patient);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return id;
        }
    }
}