using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Services;
using static Tasthy_Backend.Services.UserWorkoutPlanService;

namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserWorkoutPlanController :ControllerBase 
    {
        private readonly IUserWorkoutPlanService _service;
        public UserWorkoutPlanController(IUserWorkoutPlanService service) 
        {
            _service = service;
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserWorkoutPlans(int userId)
        {
            var result = await _service.GetUserWorkoutPlansAsync(userId);
            return Ok(result);
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRoutine([FromBody] AssignRoutineRequest request)
        {
            var success = await _service.AssignRoutineAsync(request.UserId, request.RoutineId);
            if (!success) return BadRequest("Routine already assigned.");
            return Ok(new { message = "Routine assigned successfully." });
        }
        [HttpPost("checkin")]
        public async Task<IActionResult> CheckinRoutine([FromBody] CheckinRequest request)
        {
            var result = await _service.CheckinRoutineAsync(request.UserWorkoutPlanId);

            return result switch
            {
                CheckinResult.Success => Ok(new { message = "Check-in thành công." }),
                CheckinResult.PlanNotFound => NotFound("Không tìm thấy kế hoạch tập luyện."),
                CheckinResult.AlreadyCheckedInToday => BadRequest("Bạn đã check-in kế hoạch này trong hôm nay rồi."),
                CheckinResult.NoExercisesForNextDay => BadRequest("Không có bài tập cho ngày tiếp theo."),
                _ => StatusCode(500, "Lỗi không xác định.")
            };
        }
        [HttpGet("{userWorkoutPlanId}/progress")]
        public async Task<IActionResult> GetRoutineProgress(int userWorkoutPlanId)
        {
            var progress = await _service.GetRoutineProgressAsync(userWorkoutPlanId);

            if (progress == null)
                return NotFound(new { Message = "User workout plan not found." });

            return Ok(progress);
        }
        [HttpGet("{userWorkoutPlanId}/detail")]
        public async Task<IActionResult> GetRoutineFullDetail(int userWorkoutPlanId)
        {
            var detail = await _service.GetRoutineFullDetailAsync(userWorkoutPlanId);

            if (detail == null)
                return NotFound(new { message = "UserWorkoutPlan not found" });

            return Ok(detail);
        }
        [HttpGet("progress/{userId}")]
        public async Task<IActionResult> GetUserWorkoutPlans(
            int userId,
            int pageNumber = 1,
            int pageSize = 10,
            string? goal = null,
            string? difficultyLevel = null,
            bool? isComplete = null)
        {
            var (items, totalCount) = await _service.GetUserWorkoutPlansWithProgressAsync(userId, pageNumber, pageSize, goal, difficultyLevel, isComplete);

            var response = new
            {
                TotalCount = totalCount,
                Items = items
            };

            return Ok(response);
        }
    }

    public class AssignRoutineRequest
    {
        public int UserId { get; set; }
        public int RoutineId { get; set; }
    }

    public class CheckinRequest
    {
        public int UserWorkoutPlanId { get; set; }
    }
}

