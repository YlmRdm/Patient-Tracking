using AutoMapper;
using MediatR;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Features.Users.DTOs;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.Users.Queries.GetUsers
{
    public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IEnumerable<UserDto>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public GetUsersQueryHandler(
            IUserRepository userRepository,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            var users = await _userRepository.GetAllAsync();
            
            if (!request.IncludeInactive)
            {
                users = users.Where(u => u.IsActive);
            }

            return users.Select(u => _mapper.Map<UserDto>(u));
        }
    }
}