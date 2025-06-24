using AutoMapper;
using MediatR;
using PatientTrackingPlatform.Application.Common.Exceptions;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Queries.GetNoteDetail
{
    public class GetNoteDetailQueryHandler : IRequestHandler<GetNoteDetailQuery, PatientNoteDto>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public GetNoteDetailQueryHandler(
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<PatientNoteDto> Handle(GetNoteDetailQuery request, CancellationToken cancellationToken)
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

            return _mapper.Map<PatientNoteDto>(note);
        }
    }
}