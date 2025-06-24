using AutoMapper;
using MediatR;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.Patients.Queries.SearchPatients
{
    public class SearchPatientsQueryHandler : IRequestHandler<SearchPatientsQuery, IEnumerable<PatientDto>>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public SearchPatientsQueryHandler(
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PatientDto>> Handle(SearchPatientsQuery request, CancellationToken cancellationToken)
        {
            var patients = await _patientRepository.SearchAsync(request.SearchTerm);
            
            return patients.Select(p => _mapper.Map<PatientDto>(p));
        }
    }
}