using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Models;
using Tasthy_Backend.Services;
using Tasthy_Backend.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteController :ControllerBase
    {
        private readonly IFavoriteService _favoriteService;
        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }
        [HttpPost("add")]
        public async Task<IActionResult> AddFavorite([FromQuery] int userId, [FromQuery] int recipeId)
        {
            try
            {
                await _favoriteService.AddFavoriteAsync(userId, recipeId);
                return Ok(new { message = "Thêm vào danh sách yêu thích thành công." });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFavorite([FromQuery] int userId, [FromQuery] int recipeId)
        {
            try
            {
                await _favoriteService.RemoveFavoriteAsync(userId, recipeId);
                return Ok(new { message = "Loại bỏ khỏi danh sách yêu thích" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }
        [Authorize]
        [HttpGet("getfavor")]
        public async Task<IActionResult> GetUserFavorites(int pageNumber = 1, int pageSize = 10)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Không tìm thấy thông tin người dùng trong token.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var favoriteRecipes = await _favoriteService.GetFavoritesByUserIdAsync(userId, pageNumber, pageSize);
            return Ok(favoriteRecipes);
        }

        [HttpGet("top-favorites")]
        public async Task<IActionResult> GetTopFavoritedRecipes()
        {
            try
            {
                var result = await _favoriteService.GetTop10MostFavoritedRecipesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi khi lấy danh sách món ăn được yêu thích.");
            }
        }



    }
}
