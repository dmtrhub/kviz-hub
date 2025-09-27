using FluentValidation;
using KvizHub.Application.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

namespace KvizHub.Api.Middleware;

public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
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

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        int statusCode;
        object? responseObj;

        switch (exception)
        {
            case ValidationException validationEx:
                statusCode = (int)HttpStatusCode.BadRequest;
                responseObj = new
                {
                    message = "Validation failed",
                    errors = validationEx.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
                };
                break;

            case NotFoundException notFoundEx:
                statusCode = (int)HttpStatusCode.NotFound;
                responseObj = new
                {
                    message = notFoundEx.Message
                };
                break;

            case BadRequestException badRequestEx:
                statusCode = (int)HttpStatusCode.BadRequest;
                responseObj = new
                {
                    message = badRequestEx.Message
                };
                break;

            case ForbiddenException forbiddenEx:
                statusCode = (int)HttpStatusCode.Forbidden;
                responseObj = new
                {
                    message = forbiddenEx.Message
                };
                break;

            case UnauthorizedAccessException unauthorizedEx:
                statusCode = (int)HttpStatusCode.Unauthorized;
                responseObj = new
                {
                    message = unauthorizedEx.Message
                };
                break;

            default:
                statusCode = (int)HttpStatusCode.InternalServerError;
                responseObj = new
                {
                    message = "An unexpected error occurred.",
                    detail = exception.Message
                };
                break;
        }

        context.Response.StatusCode = statusCode;
        var result = JsonSerializer.Serialize(responseObj);
        return context.Response.WriteAsync(result);
    }
}