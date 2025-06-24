using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Users.DTOs;
using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Users.Commands.CreateUser
{
    [Authorize(Roles = "Admin")]
    public class CreateUserCommand : IRequest<Guid>
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserRole Role { get; set; }

        public static CreateUserCommand FromDto(CreateUpdateUserDto dto)
        {
            return new CreateUserCommand
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = dto.Password ?? Guid.NewGuid().ToString(), 
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Role = dto.Role
            };
        }
    }
}