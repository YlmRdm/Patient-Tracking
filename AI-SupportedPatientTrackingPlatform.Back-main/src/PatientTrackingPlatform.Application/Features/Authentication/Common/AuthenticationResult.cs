namespace PatientTrackingPlatform.Application.Features.Authentication.Common
{
    public class AuthenticationResult
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty; 
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
        public bool Success { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}