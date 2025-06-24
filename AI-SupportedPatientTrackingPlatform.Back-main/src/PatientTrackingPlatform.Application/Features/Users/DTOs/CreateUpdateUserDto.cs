using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Users.DTOs
{
    public class CreateUpdateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }
}