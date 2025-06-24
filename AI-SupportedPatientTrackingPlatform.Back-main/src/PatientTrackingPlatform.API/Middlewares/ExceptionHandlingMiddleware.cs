using System.Net;
using System.Text.Json;
using PatientTrackingPlatform.Application.Common.Exceptions;

namespace PatientTrackingPlatform.API.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = HttpStatusCode.InternalServerError;
            var result = string.Empty;

            switch (exception)
            {
                case ValidationException validationEx:
                    statusCode = HttpStatusCode.BadRequest;
                    result = JsonSerializer.Serialize(new { errors = validationEx.Errors });
                    break;
                case NotFoundException notFoundEx:
                    statusCode = HttpStatusCode.NotFound;
                    result = JsonSerializer.Serialize(new { error = notFoundEx.Message });
                    break;
                case ForbiddenAccessException:
                    statusCode = HttpStatusCode.Forbidden;
                    result = JsonSerializer.Serialize(new { error = "You do not have permission to access this resource." });
                    break;
                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Unauthorized;
                    result = JsonSerializer.Serialize(new { error = "You are not authorized to access this resource." });
                    break;
                default:
                    _logger.LogError(exception, "An unhandled exception occurred");
                    result = JsonSerializer.Serialize(new { error = "An error occurred while processing your request." });
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            await context.Response.WriteAsync(result);
        }
    }
}