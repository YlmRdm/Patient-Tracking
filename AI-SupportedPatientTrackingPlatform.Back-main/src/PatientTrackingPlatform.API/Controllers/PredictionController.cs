using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PatientTrackingPlatform.Application.Common.Interfaces;

namespace PatientTrackingPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Doctor")]
    public class PredictionController : ControllerBase
    {
        private readonly IPredictionService _predictionService;

        public PredictionController(IPredictionService predictionService)
        {
            _predictionService = predictionService;
        }

        [HttpGet("{patientId}")]
        public async Task<IActionResult> GetPrediction(Guid patientId)
        {
            var result = await _predictionService.GetPredictionAsync(patientId);
            return Ok(result);
        }
    }
}