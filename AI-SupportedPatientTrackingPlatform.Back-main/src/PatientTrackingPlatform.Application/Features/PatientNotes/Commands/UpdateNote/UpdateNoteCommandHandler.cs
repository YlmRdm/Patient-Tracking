using MediatR;
using PatientTrackingPlatform.Application.Common.Exceptions;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Commands.UpdateNote
{
    public class UpdateNoteCommandHandler : IRequestHandler<UpdateNoteCommand, bool>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateNoteCommandHandler(
            IPatientRepository patientRepository,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _patientRepository = patientRepository;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(UpdateNoteCommand request, CancellationToken cancellationToken)
        {
            var patient = await _patientRepository.GetByIdAsync(request.PatientId);

            if (patient == null)
            {
                throw new NotFoundException(nameof(Patient), request.PatientId);
            }

            var note = patient.Notes.FirstOrDefault(n => n.Id == request.NoteId);

            if (note == null)
            {
                throw new NotFoundException(nameof(PatientNote), request.NoteId);
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var currentUserId))
            {
                throw new ApplicationException("Current user ID is not valid");
            }


            if (note.DoctorId != currentUserId && !_currentUserService.IsInRole("Admin"))
            {
                throw new ForbiddenAccessException();
            }

            note.UpdateContent(request.Content);
            
            await _patientRepository.UpdateAsync(patient);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
