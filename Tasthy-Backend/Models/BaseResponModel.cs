namespace Tasthy_Backend.Models
{
    public class BaseResponseModel
    {
        public object? Data { get; set; }
        public bool Success { get; set; }
        public int StatusCode { get; set; }
        public string? Message { get; set; }

        public BaseResponseModel(object? data, bool success = true, int statusCode = 200, string? message = null)
        {
            Data = data;
            Success = success;
            StatusCode = statusCode;
            Message = message;
        }
    }
}
