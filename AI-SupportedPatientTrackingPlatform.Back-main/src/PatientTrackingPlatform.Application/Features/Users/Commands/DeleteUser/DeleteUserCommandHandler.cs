using MediatR;
using PatientTrackingPlatform.Application.Common.Exceptions;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.Users.Commands.DeleteUser
{
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, bool>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;

        public DeleteUserCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
        }

        public async Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);

            if (user == null)
            {
                throw new NotFoundException(nameof(User), request.Id);
            }

            if (_currentUserService.UserId == request.Id.ToString())
            {
                throw new ForbiddenAccessException();
            }

            user.Deactivate();
            
            await _userRepository.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}