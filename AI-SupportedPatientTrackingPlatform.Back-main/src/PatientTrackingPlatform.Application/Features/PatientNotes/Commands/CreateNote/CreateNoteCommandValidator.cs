using FluentValidation;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Commands.CreateNote
{
    public class CreateNoteCommandValidator : AbstractValidator<CreateNoteCommand>
    {
        public CreateNoteCommandValidator()
        {
            RuleFor(v => v.PatientId)
                .NotEmpty().WithMessage("Patient ID is required.");

            RuleFor(v => v.Content)
                .NotEmpty().WithMessage("Content is required.")
                .MaximumLength(5000).WithMessage("Content must not exceed 5000 characters.");
        }
    }
}