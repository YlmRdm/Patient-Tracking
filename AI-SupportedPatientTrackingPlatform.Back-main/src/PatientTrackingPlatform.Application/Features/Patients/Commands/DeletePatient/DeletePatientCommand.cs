using MediatR;
using PatientTrackingPlatform.Application.Common.Security;

namespace PatientTrackingPlatform.Application.Features.Patients.Commands.DeletePatient
{
    [Authorize(Roles = "Admin")]
    public class DeletePatientCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
