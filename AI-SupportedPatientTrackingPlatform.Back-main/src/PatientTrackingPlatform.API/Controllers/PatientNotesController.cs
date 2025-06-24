using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PatientTrackingPlatform.Application.Features.PatientNotes.Commands.CreateNote;
using PatientTrackingPlatform.Application.Features.PatientNotes.Commands.UpdateNote;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;
using PatientTrackingPlatform.Application.Features.PatientNotes.Queries.GetNoteDetail;
using PatientTrackingPlatform.Application.Features.PatientNotes.Queries.GetPatientNotes;

namespace PatientTrackingPlatform.API.Controllers
{
    [ApiController]
    [Route("api/patients/{patientId}/notes")]
    [Authorize(Roles = "Admin,Doctor")]
    public class PatientNotesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PatientNotesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(Guid patientId)
        {
            var result = await _mediator.Send(new GetPatientNotesQuery { PatientId = patientId });
            return Ok(result);
        }

        [HttpGet("{noteId}")]
        public async Task<IActionResult> GetById(Guid patientId, Guid noteId)
        {
            var result = await _mediator.Send(new GetNoteDetailQuery { PatientId = patientId, NoteId = noteId });
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Guid patientId, CreateUpdateNoteDto dto)
        {
            var command = CreateNoteCommand.FromDto(patientId, dto);
            var noteId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { patientId, noteId }, null);
        }

        [HttpPut("{noteId}")]
        public async Task<IActionResult> Update(Guid patientId, Guid noteId, CreateUpdateNoteDto dto)
        {
            var command = UpdateNoteCommand.FromDto(noteId, patientId, dto);
            await _mediator.Send(command);
            return NoContent();
        }
    }
}