using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Users.DTOs;
using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Users.Commands.UpdateUser
{
    [Authorize(Roles = "Admin")]
    public class UpdateUserCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserRole Role { get; set; }

        public static UpdateUserCommand FromDto(Guid id, CreateUpdateUserDto dto)
        {
            return new UpdateUserCommand
            {
                Id = id,
                Username = dto.Username,
                Email = dto.Email,
                Password = dto.Password,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Role = dto.Role
            };
        }
    }
}