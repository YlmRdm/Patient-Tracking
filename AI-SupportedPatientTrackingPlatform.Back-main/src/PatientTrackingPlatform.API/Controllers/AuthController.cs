using MediatR;
using Microsoft.AspNetCore.Mvc;
using PatientTrackingPlatform.Application.Features.Authentication.Commands.Login;
using PatientTrackingPlatform.Application.Features.Authentication.Commands.Register;
using PatientTrackingPlatform.Application.Features.Authentication.Common;

namespace PatientTrackingPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationResult>> Login(LoginCommand command)
        {
            var result = await _mediator.Send(command);

            if (!result.Success)
            {
                return Unauthorized(new { Errors = result.Errors });
            }

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterCommand command)
        {
            var result = await _mediator.Send(command);

            if (!result.Succeeded)
            {
                return BadRequest(new { Errors = result.Errors });
            }

            return Ok(new { Message = "User registered successfully" });
        }
    }
}