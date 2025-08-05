
using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.UserExerciseDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Tasthy_Backend.Services;
namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserExercisesController : ControllerBase
    {
        private readonly IUserExerciseService _service;
        private readonly ICustomExerciseService _customExerciseService;

        public UserExercisesController(IUserExerciseService service, ICustomExerciseService customExerciseService)
        {
            _service = service;
            _customExerciseService = customExerciseService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUserExercises([FromQuery]DateTime date)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Không thể xác định người dùng.");
            }

            var exercises = await _service.GetAllUserExercisesAsync(userId,date);
            return Ok(exercises);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NewUserExerciseDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Không thể xác định người dùng.");
            }

            var result = await _service.CreateAsync(dto, userId);
            if (result)
            {
                return Ok(true);
            }

            return BadRequest(false);
        }
        [HttpPost("custom")]
        [Authorize]
        public async Task<IActionResult> CreateCustom([FromBody] NewCustomExerciseDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            try
            {
                var success = await _customExerciseService.CreateAsync(dto, userId);
                return Ok(success);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("save")]
        [Authorize]
        public async Task<IActionResult> SavePickedExercises([FromBody] List<SelectedSuggestExerciseDTO> list)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Không xác định được người dùng." });

            var success = await _service.SavePickedExercisesAsync(list, userId);
            if (success)
                return Ok(new { message = "Đã lưu bài tập thành công." });
            else
                return BadRequest(new { message = "Lưu bài tập thất bại." });
        }

    }

}
