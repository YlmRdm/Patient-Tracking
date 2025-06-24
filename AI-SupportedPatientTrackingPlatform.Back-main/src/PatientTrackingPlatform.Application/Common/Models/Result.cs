namespace PatientTrackingPlatform.Application.Common.Models
{
    public class Result
    {
        public bool Succeeded { get; }
        public string[] Errors { get; }

        internal Result(bool succeeded, IEnumerable<string> errors)
        {
            Succeeded = succeeded;
            Errors = errors.ToArray();
        }

        public static Result Success()
        {
            return new Result(true, Array.Empty<string>());
        }

        public static Result Failure(IEnumerable<string> errors)
        {
            return new Result(false, errors);
        }

        public static Result Failure(string error)
        {
            return new Result(false, new[] { error });
        }
    }

    public class Result<T> : Result
    {
        public T Data { get; }

        private Result(bool succeeded, T data, IEnumerable<string> errors)
            : base(succeeded, errors)
        {
            Data = data;
        }

        public static Result<T> Success(T data)
        {
            return new Result<T>(true, data, Array.Empty<string>());
        }

        public new static Result<T> Failure(IEnumerable<string> errors)
        {
            return new Result<T>(false, default!, errors);
        }

        public new static Result<T> Failure(string error)
        {
            return new Result<T>(false, default!, new[] { error });
        }
    }
}