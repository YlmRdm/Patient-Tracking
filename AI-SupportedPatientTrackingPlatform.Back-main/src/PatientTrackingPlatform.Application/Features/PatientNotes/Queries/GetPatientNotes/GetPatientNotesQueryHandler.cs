using AutoMapper;
using MediatR;
using PatientTrackingPlatform.Application.Common.Exceptions;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Queries.GetPatientNotes
{
    public class GetPatientNotesQueryHandler : IRequestHandler<GetPatientNotesQuery, IEnumerable<PatientNoteDto>>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public GetPatientNotesQueryHandler(
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PatientNoteDto>> Handle(GetPatientNotesQuery request, CancellationToken cancellationToken)
        {
            var patient = await _patientRepository.GetByIdAsync(request.PatientId);

            if (patient == null)
            {
                throw new NotFoundException(nameof(Patient), request.PatientId);
            }

            return patient.Notes
                .OrderByDescending(n => n.Created)
                .Select(n => _mapper.Map<PatientNoteDto>(n));
        }
    }
}