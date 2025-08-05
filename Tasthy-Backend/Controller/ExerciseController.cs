using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Models;
using Tasthy_Backend.Services;
using Tasthy_Backend.DTO;
using static Tasthy_Backend.DTO.TagDTO;
using static Tasthy_Backend.DTO.ExerciseDTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseController :ControllerBase
    {
        private readonly IExerciseService _exerciseService;
        public ExerciseController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllExercises(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string keyword = "",
        [FromQuery] bool? requiresEquipment = null,
        [FromQuery] string difficultyLevel="",
        [FromQuery] string recommendedFor = null)
        {
            var result = await _exerciseService.GetAllExercisesAsync(pageNumber, pageSize, keyword, requiresEquipment,difficultyLevel,recommendedFor);
            return Ok(result);
        }
        [HttpPost("create")]
        [Consumes("multipart/form-data")]               
        public async Task<IActionResult> CreateExercise([FromForm] ExerciseCreateUpdateRequest request)   
        {
            var success = await _exerciseService.CreateExerciseAsync(request);
            return success ? Ok("Exercise created successfully.")
                           : BadRequest("Failed to create exercise.");
        }
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]              
        public async Task<IActionResult> UpdateExercise(int id,[FromForm] ExerciseCreateUpdateRequest request)  
        {
            var success = await _exerciseService.UpdateExerciseAsync(id, request);
            if (!success)
                return NotFound("Exercise not found or update failed.");

            return Ok("Exercise updated successfully.");
        }

        [HttpGet("suggest")]
        [Authorize]
        public async Task<IActionResult> SuggestExercises(
             [FromQuery] bool? requiresEquipment,
             [FromQuery] List<string> muscleGroups,
             [FromQuery] int limit = 20)
        {
            try
            {
                // Lấy userId từ token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Không thể xác định người dùng." });
                }

                
                // Gọi service
                var exercises = await _exerciseService.SuggestExercisesForUserAsync(
                    userId,
                    requiresEquipment,
                    muscleGroups?.Select(s => s.Trim().ToLower()).ToList(),
                    limit
                );

                return Ok(exercises);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("suggest/shuffle-one")]
        [Authorize]
        public async Task<IActionResult> ShuffleOneExercise(
             [FromQuery] bool? requiresEquipment,
             [FromQuery] List<string> muscleGroups,
             [FromQuery] int currentExerciseId,
             [FromQuery] List<int>? excludeIds)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                 ?? User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Không thể xác định người dùng." });
                }
               

                var result = await _exerciseService.ShuffleOneExerciseWithDifficultyAsync(
                    userId,
                    currentExerciseId,
                    requiresEquipment,
                   muscleGroups?.Select(s => s.Trim().ToLower()).ToList(),
                   excludeIds
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("pick")]
        [Authorize]
        public async Task<IActionResult> PickExercise(
            [FromQuery] List<string> muscleGroups,
            [FromQuery] List<int> excludeExerciseIds,
            [FromQuery] bool? requiresEquipment = null)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? User.FindFirst("id")?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "Không thể xác định người dùng." });

                var exercises = await _exerciseService.PickSpecificExerciseAsync(
                    userId,
                    muscleGroups,
                    excludeExerciseIds,
                    requiresEquipment
                );

                return Ok(exercises);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




    }
}
