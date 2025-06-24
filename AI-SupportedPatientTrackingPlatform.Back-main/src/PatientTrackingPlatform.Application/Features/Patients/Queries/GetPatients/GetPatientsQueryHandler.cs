using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Common.Models;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.Patients.Queries.GetPatients
{
    public class GetPatientsQueryHandler : IRequestHandler<GetPatientsQuery, PaginatedList<PatientDto>>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public GetPatientsQueryHandler(
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<PaginatedList<PatientDto>> Handle(GetPatientsQuery request, CancellationToken cancellationToken)
        {
            var patients = await _patientRepository.GetAllAsync();
            
            var patientsDto = patients
                .Select(p => _mapper.Map<PatientDto>(p))
                .ToList();

            return PaginatedList<PatientDto>.Create(
                patientsDto,
                request.PageNumber,
                request.PageSize);
        }
    }
}