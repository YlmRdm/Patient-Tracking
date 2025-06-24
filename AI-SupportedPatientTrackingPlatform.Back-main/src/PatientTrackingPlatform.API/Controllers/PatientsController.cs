using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PatientTrackingPlatform.Application.Features.Patients.Commands.CreatePatient;
using PatientTrackingPlatform.Application.Features.Patients.Commands.DeletePatient;
using PatientTrackingPlatform.Application.Features.Patients.Commands.UpdatePatient;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;
using PatientTrackingPlatform.Application.Features.Patients.Queries.GetPatientDetail;
using PatientTrackingPlatform.Application.Features.Patients.Queries.GetPatients;
using PatientTrackingPlatform.Application.Features.Patients.Queries.SearchPatients;

namespace PatientTrackingPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Doctor")]
    public class PatientsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PatientsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] GetPatientsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetPatientDetailQuery { Id = id });
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string searchTerm)
        {
            var result = await _mediator.Send(new SearchPatientsQuery { SearchTerm = searchTerm });
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUpdatePatientDto dto)
        {
            var command = CreatePatientCommand.FromDto(dto);
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CreateUpdatePatientDto dto)
        {
            var command = UpdatePatientCommand.FromDto(id, dto);
            await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeletePatientCommand { Id = id });
            return NoContent();
        }
    }
}