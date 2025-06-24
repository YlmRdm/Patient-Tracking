using PatientTrackingPlatform.Application.Common.Mappings;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Enums;

namespace PatientTrackingPlatform.Application.Features.Users.DTOs
{
    public class UserDto : IMapFrom<User>
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public bool IsActive { get; set; }
        public string FullName => $"{FirstName} {LastName}";
        public DateTime Created { get; set; }
        public DateTime? LastModified { get; set; }

        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<User, UserDto>();
        }
    }
}