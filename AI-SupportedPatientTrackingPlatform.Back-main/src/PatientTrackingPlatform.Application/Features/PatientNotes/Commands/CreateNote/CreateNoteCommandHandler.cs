using MediatR;
using PatientTrackingPlatform.Application.Common.Exceptions;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Commands.CreateNote
{
    public class CreateNoteCommandHandler : IRequestHandler<CreateNoteCommand, Guid>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateNoteCommandHandler(
            IPatientRepository patientRepository,
            ICurrentUserService currentUserService,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _patientRepository = patientRepository;
            _currentUserService = currentUserService;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> Handle(CreateNoteCommand request, CancellationToken cancellationToken)
        {
            var patient = await _patientRepository.GetByIdAsync(request.PatientId);

            if (patient == null)
            {
                throw new NotFoundException(nameof(Patient), request.PatientId);
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var doctorId))
            {
                throw new ApplicationException("Current user ID is not valid");
            }

            var doctor = await _userRepository.GetByIdAsync(doctorId);

            if (doctor == null)
            {
                throw new NotFoundException(nameof(User), doctorId);
            }

            var doctorName = $"{doctor.FirstName} {doctor.LastName}";

            var note = new PatientNote(patient.Id, request.Content, doctorId, doctorName);

            await _patientRepository.AddNoteAsync(note, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return note.Id;
        }
    }
}