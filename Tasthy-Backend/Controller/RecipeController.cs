using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Models;
using Tasthy_Backend.Services;
using Tasthy_Backend.DTO;
using static Tasthy_Backend.DTO.RecipeDTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController: ControllerBase
    {
        private readonly IRecipeService _recipeService;

        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }
        [HttpGet("getall")]
        public async Task<IActionResult> GetAllRecipes(int pageNumber = 1, int pageSize = 12)
        {
            var recipes = await _recipeService.GetAllRecipes(pageNumber, pageSize);
            return Ok(recipes);
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchRecipes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string keyword = "")
        {
            try
            {
                var result = await _recipeService.GetAllRecipesWithPagination(pageNumber, pageSize, keyword);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi khi tìm kiếm món ăn.");
            }
        }

        [HttpGet("getbyId/{id}")]
        public async Task<IActionResult> GetRecipeById(int id,int UserID)
        {
            var recipe = await _recipeService.GetRecipeById(id,UserID);
            if (recipe == null)
            {
                return NotFound();
            }
            return Ok(recipe);
        }
        [HttpGet("getbyTag")]
        public async Task<IActionResult> GetRecipesByTag(string tagName, int pageNumber=1, int pageSize=12)
        {
            var recipe = await _recipeService.GetRecipesByTag(tagName, pageNumber, pageSize);
            if (recipe == null)
            {
                return NotFound();
            }
            return Ok(recipe);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateRecipe([FromForm] RecipeCreateDTO dto, IFormFile? imageFile)
        {
            var recipe = await _recipeService.AddRecipe(dto, imageFile);
            return Ok(recipe);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, [FromForm] RecipeUpdateRequest request, IFormFile? imageFile)
        {
            var result = await _recipeService.UpdateRecipeAsync(id, request, imageFile);
            if (!result)
                return NotFound();

            return Ok();
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var result = await _recipeService.DeleteRecipe(id);
            if (!result)
            {
                return NotFound();
            }
            return Ok(new { message = "Deleted successfully" });
        }
        [HttpGet("withoutNutrition")]
        public async Task<IActionResult> GetRecipesWithoutNutrition(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string keyword = "")
        {
            var recipes = await _recipeService.GetRecipesWithoutNutritionAsync(pageNumber, pageSize, keyword);
            return Ok(recipes);
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllReCipeforAdmin([FromQuery]  int pageNumber = 1,
            [FromQuery]  int pageSize = 10,
           [FromQuery] string keyword = "",
           [FromQuery] List<int> tagIds = null)
        {
            var recipes = await _recipeService.GetAllRecipesForAdminAsync(pageNumber, pageSize,keyword,tagIds);
            return Ok(recipes);
        }
        [HttpGet("adminbyid/{id}")]
        public async Task<IActionResult> GetRecipeById(int id)
        {
            var recipe = await _recipeService.GetRecipeDetailByIdForAdmin(id);
            if (recipe == null)
            {
                return NotFound();
            }
            return Ok(recipe);
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetMultipleHealthCarousels()
        {
            try
            {
                var healthTags = new List<string>
        {
            "hỗ trợ gan",
            "bổ máu",
            "hỗ trợ thận",
            "tốt cho xương",
            "giúp làm việc hiệu quả"
        };

                var result = await _recipeService.GetMultipleHealthTagCarouselsAsync(healthTags);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Lỗi khi lấy dữ liệu carousel sức khỏe.");
            }
        }

        public class IngredientSuggestDTO
        {
            public List<string> Ingredients { get; set; }
        }

        [HttpPost("suggest-by-ingredients")]
        public async Task<IActionResult> SuggestByIngredients([FromBody] IngredientSuggestDTO dto)
        {
            try
            {
                var result = await _recipeService.SuggestRecipesByIngredientsAsync(dto.Ingredients);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Lỗi khi gợi ý món ăn theo nguyên liệu.");
            }
        }
        public class SuggestRequestDTO
        {
            public int RecipeId { get; set; }
        }

        [HttpPost("suggest-by-taste")]
        [Authorize]
        public async Task<IActionResult> SuggestByTaste([FromBody] SuggestRequestDTO request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("Không tìm thấy thông tin người dùng trong token.");
                }

                int userId = int.Parse(userIdClaim.Value);
                var result = await _recipeService.SuggestRecipesByTasteAsync(userId, request.RecipeId);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Lỗi khi gợi ý món ăn theo khẩu vị");
            }
        }
        [HttpGet("from-user")]
        public async Task<IActionResult> GetUserCreatedRecipes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var recipes = await _recipeService.GetUserCreatedRecipesAsync(pageNumber, pageSize);
            return Ok(recipes);
        }
    }
}
