using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.RecipeDTO;
using Microsoft.AspNetCore.Http;
using System.Globalization;
using Azure.Core;

namespace Tasthy_Backend.Services
{ 
    public interface IRecipeService
    {
        Task<List<RecipeSimpleDTO>> GetAllRecipes(int pageNumber = 1, int pageSize = 10);
        Task<RecipePaginationDTO> GetAllRecipesWithPagination(int pageNumber = 1, int pageSize = 10, string keyword = "");
        Task<RecipeDetailDTO?> GetRecipeById(int id,int UserId);
        Task<RecipeManageDTO> AddRecipe(RecipeCreateDTO dto, IFormFile? imageFile);
        Task<bool> UpdateRecipeAsync(int id, RecipeUpdateRequest request, IFormFile? imageFile);
        Task<bool> DeleteRecipe(int id);
        Task<RecipePaginationDTO> GetRecipesByTag(string tagName, int pageNumber = 1, int pageSize = 12);
        Task<RecipePaginationDTO> GetAllRecipesForAdminAsync(
              int pageNumber = 1,
              int pageSize = 10,
              string keyword = "",
              List<int> tagIds = null);
        Task<RecipePaginationDTO> GetRecipesWithoutNutritionAsync(
             int pageNumber = 1,
             int pageSize = 10,
             string keyword = "");
        Task<RecipeManageDTO?> GetRecipeDetailByIdForAdmin(int recipeId);
        Task<Dictionary<string, List<RecipeSimpleDTO>>> GetMultipleHealthTagCarouselsAsync(List<string> tagKeywords);
        Task<List<RecipeSimpleDTO>> SuggestRecipesByIngredientsAsync(List<string> inputIngredients);
        Task<List<RecipeSimpleDTO>> SuggestRecipesByTasteAsync(int userId, int currentRecipeId);
        Task<List<RecipeSimpleDTO>> GetUserCreatedRecipesAsync(int pageNumber = 1, int pageSize = 10);

    }
    public class RecipeService:IRecipeService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RecipeService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<RecipeSimpleDTO>> GetAllRecipes(int pageNumber = 1, int pageSize = 10)
        {
            int skip = (pageNumber - 1) * pageSize;
            return await _context.Recipes
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty,

                })
                .ToListAsync();
        }
        public async Task<RecipePaginationDTO> GetAllRecipesWithPagination(int pageNumber = 1, int pageSize = 10, string keyword = "")
        {
            int skip = (pageNumber - 1) * pageSize;

            var query = _context.Recipes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(r => r.Title.ToLower().Contains(keyword));
            }

            var totalCount = await query.CountAsync();

            var recipes = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty
                })
                .ToListAsync();

            return new RecipePaginationDTO
            {
                Recipes = recipes,
                TotalRecords = totalCount
            };
        }


        public async Task<RecipeDetailDTO?> GetRecipeById(int id,int userID)
        {
            var recipe = await _context.Recipes
                 .Include(r => r.User)
                .Include(r => r.RecipeTags)
                .ThenInclude(rt => rt.Tag)
                .Include(r => r.Nutritions)
                 .Include(r => r.Comments).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(r => r.RecipeID == id);

            if (recipe == null)
                return null;
            bool isFavor = _context.Favorites
        .Any(f => f.RecipeID == id && f.UserID == userID);

          

            return new RecipeDetailDTO
            {
                RecipeID = recipe.RecipeID,
                UserName=recipe.User.Name,
                Title = recipe.Title,
                Description = recipe.Description,
                Servings = recipe.Servings,
                CookingTime = recipe.CookingTime,
                CreatedAt = recipe.CreatedAt,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                RecipeIMG = !string.IsNullOrEmpty(recipe.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{recipe.RecipeIMG}"
                        : string.Empty,
                IsFavor=isFavor,
                Tags = recipe.RecipeTags.Select(rt => rt.Tag.TagName).ToList(),
                Nutrition = recipe.Nutritions == null ? null : new NutritionDTO
                {
                    Calories = recipe.Nutritions.Calories,
                    Protein = recipe.Nutritions.Protein,
                    Carbs = recipe.Nutritions.Carbs,
                    Fat = recipe.Nutritions.Fat
                },
               
            };
        }
        public async Task<RecipePaginationDTO> GetRecipesByTag(string tagName, int pageNumber = 1, int pageSize = 12)
        {
            int skip = (pageNumber - 1) * pageSize;

            var query = _context.Recipes
                .Include(r => r.RecipeTags)
                    .ThenInclude(rt => rt.Tag)
                .Include(r => r.User)
                .Where(r => r.RecipeTags.Any(rt => rt.Tag.TagName == tagName));

            var totalCount = await query.CountAsync();

            var recipes = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty
                })
                .ToListAsync();

            return new RecipePaginationDTO
            {
                Recipes = recipes,
                TotalRecords = totalCount
            };
        }


        public async Task<RecipeManageDTO> AddRecipe(RecipeCreateDTO dto, IFormFile? imageFile)
        {
            // 1. Xử lý ảnh
            string? fileName = null;
            if (imageFile != null && imageFile.Length > 0)
            {
                fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "IMG", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await imageFile.CopyToAsync(stream);
            }

            // 2. Tạo Recipe
            var recipe = new Recipe
            {
                UserID = dto.UserID,
                Title = dto.Title,
                Description = dto.Description,
                Servings = dto.Servings,
                CookingTime = dto.CookingTime,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                RecipeIMG = fileName
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // 3. Gán Tags
            foreach (var tagName in dto.Tags.Distinct())
            {
                var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == tagName);
                if (tag == null)
                {
                    tag = new Tag { TagName = tagName };
                    _context.Tags.Add(tag);
                    await _context.SaveChangesAsync();
                }

                _context.RecipeTags.Add(new RecipeTag
                {
                    RecipeID = recipe.RecipeID,
                    TagID = tag.TagID
                });
            }

            // 4. Thêm Nutrition nếu có
            if (dto.Nutrition != null)
            {
                var nutrition = new Nutrition
                {
                    RecipeID = recipe.RecipeID,
                    Calories = ParseFlexibleFloat(dto.Nutrition.Calories),
                    Protein = ParseFlexibleFloat(dto.Nutrition.Protein),
                    Carbs = ParseFlexibleFloat(dto.Nutrition.Carbs),
                    Fat = ParseFlexibleFloat(dto.Nutrition.Fat)
                };
                _context.Nutritions.Add(nutrition);
            }

            await _context.SaveChangesAsync();

            // 5. Load lại recipe kèm navigation properties để tạo DTO
            var fullRecipe = await _context.Recipes
                .Include(r => r.User)
                .Include(r => r.RecipeTags).ThenInclude(rt => rt.Tag)
                .Include(r => r.Nutritions)
                .FirstOrDefaultAsync(r => r.RecipeID == recipe.RecipeID);

            if (fullRecipe == null)
                throw new Exception("Không tìm thấy recipe sau khi tạo.");

            // 6. Tạo DTO trả về
            var result = new RecipeManageDTO
            {
                RecipeID = fullRecipe.RecipeID,
                UserName = fullRecipe.User?.UserName ?? "Unknown",
                Title = fullRecipe.Title,
                Description = fullRecipe.Description,
                Servings = fullRecipe.Servings,
                CookingTime = fullRecipe.CookingTime,
                CreatedAt = fullRecipe.CreatedAt,
                Ingredients = fullRecipe.Ingredients,
                Instructions = fullRecipe.Instructions,
                RecipeIMG = fullRecipe.RecipeIMG,
                Tags = fullRecipe.RecipeTags.Select(rt => rt.Tag.TagName).ToList(),
                Nutrition = fullRecipe.Nutritions == null ? null : new NutritionDTO
                {
                    Calories = fullRecipe.Nutritions.Calories,
                    Protein = fullRecipe.Nutritions.Protein,
                    Carbs = fullRecipe.Nutritions.Carbs,
                    Fat = fullRecipe.Nutritions.Fat,
                }
            };

            return result;
        }

        private float ParseFlexibleFloat(string? input)
        {
            if (string.IsNullOrWhiteSpace(input)) return 0;
            input = input.Trim().Replace(',', '.');
            return float.TryParse(input, NumberStyles.Any, CultureInfo.InvariantCulture, out var result)
                ? result
                : 0;
        }

        public async Task<bool> UpdateRecipeAsync(int id, RecipeUpdateRequest request, IFormFile? imageFile)
        {
            var recipe = await _context.Recipes
                .Include(r => r.RecipeTags)
                .Include(r => r.Nutritions)
                .FirstOrDefaultAsync(r => r.RecipeID == id);

            if (recipe == null) return false;

            // Xử lý ảnh (nếu có)
            if (imageFile != null && imageFile.Length > 0)
            {
                string fileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "IMG", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await imageFile.CopyToAsync(stream);

                recipe.RecipeIMG = fileName;
            }

            // Cập nhật thông tin cơ bản
            recipe.Title = request.Title;
            recipe.Description = request.Description;
            recipe.Servings = request.Servings ?? recipe.Servings;
            recipe.CookingTime = request.CookingTime ?? recipe.CookingTime;
            recipe.Ingredients = request.Ingredients;
            recipe.Instructions = request.Instructions;

            // Xử lý tag nếu có
            if (request.TagNames != null)
            {
                // Xoá tag cũ
                _context.RecipeTags.RemoveRange(recipe.RecipeTags);

                var tagEntities = new List<Tag>();
                foreach (var tagName in request.TagNames.Distinct())
                {
                    var tag = await _context.Tags.FirstOrDefaultAsync(t => t.TagName == tagName);
                    if (tag == null)
                    {
                        tag = new Tag { TagName = tagName };
                        _context.Tags.Add(tag);
                        await _context.SaveChangesAsync();
                    }
                    tagEntities.Add(tag);
                }

                recipe.RecipeTags = tagEntities.Select(t => new RecipeTag
                {
                    RecipeID = recipe.RecipeID,
                    TagID = t.TagID
                }).ToList();
            }
            float calories = ParseFlexibleFloat(request.Calories);
            float protein = ParseFlexibleFloat(request.Protein);
            float carbs = ParseFlexibleFloat(request.Carbs);
            float fat = ParseFlexibleFloat(request.Fat);
            // Cập nhật hoặc thêm Nutrition
            var nutrition = await _context.Nutritions.FirstOrDefaultAsync(n => n.RecipeID == id);

            if (nutrition == null)
            {
                _context.Nutritions.Add(new Nutrition
                {
                    RecipeID = id,
                    Calories = calories,
                    Protein = protein,
                    Carbs = carbs,
                    Fat = fat
                });
            }
            else
            {
                nutrition.Calories = calories;
                nutrition.Protein = protein;
                nutrition.Carbs = carbs;
                nutrition.Fat = fat;
            }

            await _context.SaveChangesAsync();
            return true;
        }



        public async Task<bool> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null) return false;

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<RecipePaginationDTO> GetAllRecipesForAdminAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string keyword = "",
            List<int> tagIds = null)
        {
            var query = _context.Recipes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(r => r.Title.ToLower().Contains(keyword));
            }

            if (tagIds != null && tagIds.Count > 0)
            {
                query = query.Where(r => r.RecipeTags.Any(rt => tagIds.Contains(rt.TagID)));
            }

            var totalRecords = await query.CountAsync();
            var skip = (pageNumber - 1) * pageSize;

            var recipes = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty
                })
                .ToListAsync();

            return new RecipePaginationDTO
            {
                Recipes = recipes,
                TotalRecords = totalRecords
            };
        }

        public async Task<RecipeManageDTO?> GetRecipeDetailByIdForAdmin(int recipeId)
        {
            var recipe = await _context.Recipes
                .Include(r => r.User)
                .Include(r => r.RecipeTags).ThenInclude(rt => rt.Tag)
                .Include(r => r.Nutritions)
                .Include(r => r.Comments).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(r => r.RecipeID == recipeId);

            if (recipe == null)
                return null;

            return new RecipeManageDTO
            {
                RecipeID = recipe.RecipeID,
                UserName = recipe.User?.Name ?? "Unknown",
                Title = recipe.Title,
                Description = recipe.Description,
                Servings = recipe.Servings,
                CookingTime = recipe.CookingTime,
                CreatedAt = recipe.CreatedAt,
                Ingredients = recipe.Ingredients,
                Instructions = recipe.Instructions,
                RecipeIMG = !string.IsNullOrEmpty(recipe.RecipeIMG)
                    ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{recipe.RecipeIMG}"
                    : string.Empty,
                Tags = recipe.RecipeTags.Select(rt => rt.Tag.TagName).ToList(),
                Nutrition = recipe.Nutritions == null ? null : new NutritionDTO
                {
                    Calories = recipe.Nutritions.Calories,
                    Protein = recipe.Nutritions.Protein,
                    Carbs = recipe.Nutritions.Carbs,
                    Fat = recipe.Nutritions.Fat
                }
            };
        }

        public async Task<RecipePaginationDTO> GetRecipesWithoutNutritionAsync(
             int pageNumber = 1,
             int pageSize = 10,
             string keyword = "")
        {
            var query = _context.Recipes
                .Where(r => !_context.Nutritions.Any(n => n.RecipeID == r.RecipeID));

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(r => r.Title.ToLower().Contains(keyword));
            }

            var totalRecords = await query.CountAsync();
            var skip = (pageNumber - 1) * pageSize;

            var recipes = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty
                })
                .ToListAsync();

            return new RecipePaginationDTO
            {
                Recipes = recipes,
                TotalRecords = totalRecords
            };
        }
        public async Task<Dictionary<string, List<RecipeSimpleDTO>>> GetMultipleHealthTagCarouselsAsync(List<string> tagKeywords)
        {
            var result = new Dictionary<string, List<RecipeSimpleDTO>>();

            foreach (var tag in tagKeywords)
            {
                var keyword = tag.Trim().ToLower();

                var recipes = await _context.Recipes
                    .Where(r => r.RecipeTags.Any(rt => rt.Tag.TagName.ToLower().Contains(keyword)))
                    .OrderByDescending(r => r.CreatedAt)
                    .Take(10)
                    .Select(r => new RecipeSimpleDTO
                    {
                        RecipeID = r.RecipeID,
                        Title = r.Title,
                        RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                            ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                            : string.Empty,
                        Servings=r.Servings,
                        CookingTime=r.CookingTime
                    })
                    .ToListAsync();

                result[tag] = recipes;
            }

            return result;
        }
        public async Task<List<RecipeSimpleDTO>> SuggestRecipesByIngredientsAsync(List<string> inputIngredients)
        {
            inputIngredients = inputIngredients
                .Where(i => !string.IsNullOrWhiteSpace(i))
                .Select(i => i.Trim().ToLower())
                .ToList();

            var recipes = await _context.Recipes
                .Where(r => inputIngredients.All(ingredient =>
                    r.Ingredients.Replace("\r\n", " ")
                                 .Replace(",", " ")
                                 .ToLower()
                                 .Contains(ingredient)))
                .OrderByDescending(r => r.CreatedAt)
                .Take(20)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty
                })
                .ToListAsync();

            return recipes;
        }

        public async Task<List<RecipeSimpleDTO>> SuggestRecipesByTasteAsync(int userId, int currentRecipeId)
        {
            // 1. Lấy tag của món hiện tại
            var currentTagIds = await _context.RecipeTags
                .Where(rt => rt.RecipeID == currentRecipeId)
                .Select(rt => rt.TagID)
                .ToListAsync();

            // 2. Lấy 3 món khác có cùng tag với món hiện tại
            var similarRecipes = await _context.Recipes
                .Where(r => r.RecipeID != currentRecipeId &&
                            r.RecipeTags.Any(rt => currentTagIds.Contains(rt.TagID)))
                .OrderByDescending(r => r.CreatedAt)
                .Take(3)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty
                })
                .ToListAsync();

            // 3. Lấy món yêu thích & đã chọn
            var likedRecipeIds = await _context.Favorites
                .Where(f => f.UserID == userId)
                .Select(f => f.RecipeID)
                .ToListAsync();

            var selectedRecipeIds = await _context.SelectedMeals
                .Where(s => s.UserID == userId)
                .Select(s => s.RecipeID)
                .ToListAsync();

            var allRecipeIds = likedRecipeIds.Union(selectedRecipeIds).ToList();

            // 4. Lấy top tag từ các món đó
            var topTagIds = await _context.RecipeTags
                .Where(rt => allRecipeIds.Contains(rt.RecipeID))
                .GroupBy(rt => rt.TagID)
                .OrderByDescending(g => g.Count())
                .Take(3)
                .Select(g => g.Key)
                .ToListAsync();

            // 5. Gợi ý thêm món từ sở thích (không trùng với currentRecipe hoặc các món đã chọn)
            var likedBasedSuggestions = await _context.Recipes
                .Where(r => r.RecipeID != currentRecipeId &&
                            !allRecipeIds.Contains(r.RecipeID) &&
                            r.RecipeTags.Any(rt => topTagIds.Contains(rt.TagID)))
                .OrderByDescending(r => r.CreatedAt)
                .Take(7) // max 10 món tổng
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty
                })
                .ToListAsync();

            // 6. Gộp kết quả & loại trùng
            var allSuggestions = similarRecipes
                .Concat(likedBasedSuggestions)
                .GroupBy(r => r.RecipeID)
                .Select(g => g.First())
                .Take(10)
                .ToList();

            return allSuggestions;
        }

        public async Task<List<RecipeSimpleDTO>> GetUserCreatedRecipesAsync(int pageNumber = 1, int pageSize = 10)
        {
            int skip = (pageNumber - 1) * pageSize;

            var recipes = await _context.Recipes
                .Include(r => r.User)
                .Where(r => r.User.Role != "Admin") // truy cập trực tiếp từ quan hệ
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => new RecipeSimpleDTO
                {
                    RecipeID = r.RecipeID,
                    Title = r.Title,
                    RecipeIMG = !string.IsNullOrEmpty(r.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{r.RecipeIMG}"
                        : string.Empty,
                })
                .ToListAsync();

            return recipes;
        }




    }
}
