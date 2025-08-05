
using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Models;
using Tasthy_Backend.Services;
using Tasthy_Backend.DTO;
using static Tasthy_Backend.DTO.UserDTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using static Tasthy_Backend.DTO.SelectedMealDTO;
namespace Tasthy_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class SelectedMealsController : ControllerBase
    {
        private readonly ISelectedMealService _service;
        private readonly ICustomMealService _customMealService;

        public SelectedMealsController(ISelectedMealService service ,ICustomMealService custommealService)
        {
            _service = service;
            _customMealService = custommealService;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] DateTime date)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Không thể xác định người dùng.");
            }

            var result = await _service.GetAllAsync(userId,date);
            if (result == null)
            {
                return NotFound("Not found.");
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NewSelectedMealDTO dto)
        {
            var result = await _service.CreateAsync(dto);

            if (result)
            {
                return Ok(true); // Thành công
            }

            return BadRequest(false); // Thất bại
        }
        [HttpPost("custom")]
        [Authorize]
        public async Task<IActionResult> CreateCustom([FromBody] NewCustomMealDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            try
            {
                var success = await _customMealService.CreateAsync(dto, userId);
                return Ok(success);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




    }
}