using FluentValidation;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Application.Features.Users.Commands.UpdateUser
{
    public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
    {
        private readonly IUserRepository _userRepository;

        public UpdateUserCommandValidator(IUserRepository userRepository)
        {
            _userRepository = userRepository;

            RuleFor(v => v.Id)
                .NotEmpty().WithMessage("User ID is required.");

            RuleFor(v => v.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Email is not valid.")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters.")
                .MustAsync(BeUniqueEmail).WithMessage("The specified email already exists.");

            RuleFor(v => v.Password)
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
                .When(v => !string.IsNullOrEmpty(v.Password), ApplyConditionTo.CurrentValidator);

            RuleFor(v => v.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

            RuleFor(v => v.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");

            RuleFor(v => v.Username)
                .MustAsync(BeUniqueUsername).WithMessage("Username is already taken.")
                .When(v => !string.IsNullOrEmpty(v.Username), ApplyConditionTo.CurrentValidator);
        }

        public async Task<bool> BeUniqueEmail(UpdateUserCommand command, string email, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetByEmailAsync(email);
            return existingUser == null || existingUser.Id == command.Id;
        }

        public async Task<bool> BeUniqueUsername(UpdateUserCommand command, string username, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(username);
            return existingUser == null || existingUser.Id == command.Id;
        }
    }
}