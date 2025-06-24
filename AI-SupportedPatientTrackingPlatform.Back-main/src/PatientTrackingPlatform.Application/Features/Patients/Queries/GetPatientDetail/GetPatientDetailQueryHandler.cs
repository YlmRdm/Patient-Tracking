using AutoMapper;
using MediatR;
using PatientTrackingPlatform.Application.Common.Exceptions;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.Patients.Queries.GetPatientDetail
{
    public class GetPatientDetailQueryHandler : IRequestHandler<GetPatientDetailQuery, PatientDetailDto>
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public GetPatientDetailQueryHandler(
            IPatientRepository patientRepository,
            IMapper mapper)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<PatientDetailDto> Handle(GetPatientDetailQuery request, CancellationToken cancellationToken)
        {
            var patient = await _patientRepository.GetByIdAsync(request.Id);

            if (patient == null)
            {
                throw new NotFoundException(nameof(Patient), request.Id);
            }

            return _mapper.Map<PatientDetailDto>(patient);
        }
    }
}