using MediatR;
using Microsoft.Extensions.Logging;
using PatientTrackingPlatform.Application.Common.Interfaces;
using System.Diagnostics;

namespace PatientTrackingPlatform.Application.Common.Behaviors
{
    public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : notnull
    {
        private readonly Stopwatch _timer;
        private readonly ILogger<TRequest> _logger;
        private readonly ICurrentUserService _currentUserService;

        public PerformanceBehavior(
            ILogger<TRequest> logger,
            ICurrentUserService currentUserService)
        {
            _timer = new Stopwatch();
            _logger = logger;
            _currentUserService = currentUserService;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            _timer.Start();

            var response = await next();

            _timer.Stop();

            var elapsedMilliseconds = _timer.ElapsedMilliseconds;

            if (elapsedMilliseconds > 500)
            {
                var requestName = typeof(TRequest).Name;
                var userId = _currentUserService.UserId ?? "Anonymous";
                var userName = _currentUserService.Username ?? "Anonymous";

                _logger.LogWarning("Long running request: {RequestName} ({ElapsedMilliseconds} milliseconds) for User: {UserId} ({UserName})",
                    requestName, elapsedMilliseconds, userId, userName);
            }

            return response;
        }
    }
}