using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PatientTrackingPlatform.Application.Features.Users.Commands.CreateUser;
using PatientTrackingPlatform.Application.Features.Users.Commands.DeleteUser;
using PatientTrackingPlatform.Application.Features.Users.Commands.UpdateUser;
using PatientTrackingPlatform.Application.Features.Users.DTOs;
using PatientTrackingPlatform.Application.Features.Users.Queries.GetUserDetail;
using PatientTrackingPlatform.Application.Features.Users.Queries.GetUsers;

namespace PatientTrackingPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Doctor")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            var result = await _mediator.Send(new GetUsersQuery { IncludeInactive = includeInactive });
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize] 
        public async Task<IActionResult> GetById(Guid id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId != id.ToString() && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var result = await _mediator.Send(new GetUserDetailQuery { Id = id });
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUpdateUserDto dto)
        {
            var command = CreateUserCommand.FromDto(dto);
            var userId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = userId }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CreateUpdateUserDto dto)
        {
            var command = UpdateUserCommand.FromDto(id, dto);
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteUserCommand { Id = id });
            return NoContent();
        }
    }
}