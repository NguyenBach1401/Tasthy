using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Models;
using Tasthy_Backend.Services;
using Tasthy_Backend.DTO;
using static Tasthy_Backend.DTO.UserDTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterRequest request)
        {
            try
            {
                var success = await _userService.Register(request);
                if (!success)
                    throw new Exception("Registration failed.");

                return Ok(new BaseResponseModel("Registered successfully"));
            }
            catch (Exception ex)
            {
                return Ok(new BaseResponseModel(null, false, StatusCodes.Status500InternalServerError, ex.Message));
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginRequest request)
        {
            try
            {
                // Gọi service Login để xác thực người dùng và lấy token
                var userResponse = await _userService.Login(request);

                if (userResponse == null)
                {
                    return Unauthorized(new BaseResponseModel(null, false, StatusCodes.Status401Unauthorized, "Invalid username or password."));
                }

             
                return Ok(new
                {
                    message = "Đăng nhập thành công",
                    userResponse.Token,
                    userResponse.UserName,
                    userResponse.UserID,
                    userResponse.Role,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new BaseResponseModel(null, false, StatusCodes.Status500InternalServerError, ex.Message));
            }
        }
        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var userProfile = await _userService.GetUserProfile(userId);

            if (userProfile == null)
            {
                return NotFound("User not found.");
            }

            return Ok(userProfile);
        }
        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfile request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("Không tìm thấy thông tin người dùng trong token.");

            int userId = int.Parse(userIdClaim.Value);

            var result = await _userService.UpdateUserProfile(userId, request);
            if (!result)
                return BadRequest("Cập nhật không thành công.");

            return Ok("Cập nhật thông tin thành công.");
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string keyword = "",
            [FromQuery] string gender = "",
            [FromQuery] string activityLevel = "")
        {
            var users = await _userService.GetAllUsersAsync(pageNumber, pageSize, keyword, gender, activityLevel);
            return Ok(users);
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("health-summary")]
        [Authorize]
        public async Task<IActionResult> GetUserHealthSummary()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("Không tìm thấy thông tin người dùng trong token.");
                }

                int userId = int.Parse(userIdClaim.Value);

                var summary = await _userService.GetUserHealthInfoAsync(userId);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}");
            }
        }
    }




}
