using System.Text.Json;
using Microsoft.Extensions.Logging;
using PatientTrackingPlatform.Application.Common.Interfaces;

namespace PatientTrackingPlatform.Infrastructure.Services
{
    public class MockPredictionService : IPredictionService
    {
        private readonly ILogger<MockPredictionService> _logger;

        public MockPredictionService(ILogger<MockPredictionService> logger)
        {
            _logger = logger;
        }

        public Task<object> GetPredictionAsync(Guid patientId)
        {
            _logger.LogInformation("Generating prediction for patient {PatientId}", patientId);

            var prediction = new
            {
                PatientId = patientId,
                Predictions = new[]
                {
                    new {
                        Condition = "Diabetes Type 2",
                        Probability = 0.25,
                        SeverityScore = 0.4,
                        RecommendedAction = "Regular monitoring of blood sugar levels"
                    },
                    new {
                        Condition = "Hypertension",
                        Probability = 0.45,
                        SeverityScore = 0.5,
                        RecommendedAction = "Regular blood pressure checks, dietary advice"
                    },
                    new {
                        Condition = "Coronary Heart Disease",
                        Probability = 0.15,
                        SeverityScore = 0.7,
                        RecommendedAction = "Cardiac evaluation, lipid profile assessment"
                    }
                },
                RiskScore = 0.35,
                GeneratedAt = DateTime.UtcNow,
                ModelVersion = "1.0.0"
            };

            _logger.LogInformation("Prediction generated: {Prediction}", JsonSerializer.Serialize(prediction));

            return Task.FromResult<object>(prediction);
        }
    }
}