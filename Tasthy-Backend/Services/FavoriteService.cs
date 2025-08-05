using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using Microsoft.AspNetCore.Mvc;
using static Tasthy_Backend.DTO.RecipeDTO;
namespace Tasthy_Backend.Services
{
    public interface IFavoriteService
    {
        Task AddFavoriteAsync(int userId, int recipeId);
        Task RemoveFavoriteAsync(int userId, int recipeId);
        Task<RicipeFavoriteDTO> GetFavoritesByUserIdAsync(int userId, int pageNumber = 1, int pageSize = 10);
        Task<List<PopularRecipeDTO>> GetTop10MostFavoritedRecipesAsync();
    }
    public class FavoriteService : IFavoriteService
    {
       
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FavoriteService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task AddFavoriteAsync(int userId, int recipeId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserID == userId);
            var recipeExists = await _context.Recipes.AnyAsync(r => r.RecipeID == recipeId);

            if (!userExists || !recipeExists)
            {
                throw new ArgumentException("User hoặc món ăn không tồn tại.");
            }

           
            bool isAlreadyFavorited = await _context.Favorites
                .AnyAsync(f => f.UserID == userId && f.RecipeID == recipeId);

            if (isAlreadyFavorited)
            {
                throw new InvalidOperationException("Bạn đã thích món ăn này rồi.");
            }

          
            var favorite = new Favorite
            {
                UserID = userId,
                RecipeID = recipeId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveFavoriteAsync(int userId, int recipeId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserID == userId && f.RecipeID == recipeId);
            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<RicipeFavoriteDTO> GetFavoritesByUserIdAsync(int userId, int pageNumber = 1, int pageSize = 10)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserID == userId);
            if (!userExists)
            {
                throw new ArgumentException("Người dùng không tồn tại.");
            }

            int skip = (pageNumber - 1) * pageSize;

            // Đếm tổng số món yêu thích của người dùng (phục vụ phân trang)
            int totalFavorites = await _context.Favorites
                .CountAsync(f => f.UserID == userId);

            var favoriteRecipes = await _context.Favorites
                .Where(f => f.UserID == userId)
                .Include(f => f.Recipe)
                .OrderByDescending(f => f.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .Select(f => new RecipeFavorDTO
                {
                    Title = f.Recipe.Title,
                    RecipeIMG = !string.IsNullOrEmpty(f.Recipe.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{f.Recipe.RecipeIMG}"
                        : string.Empty,
                    Servings = f.Recipe.Servings,
                    CookingTime = f.Recipe.CookingTime
                })
                .ToListAsync();

            return new RicipeFavoriteDTO
            {
                RecipeFavors = favoriteRecipes,
                TotalRecipes = totalFavorites
            };
        }

        public async Task<List<PopularRecipeDTO>> GetTop10MostFavoritedRecipesAsync()
        {
            var topFavorites = await _context.Favorites
                .GroupBy(f => new
                {
                    f.RecipeID,
                    f.Recipe.Title,
                    f.Recipe.RecipeIMG
                })
                .Select(g => new PopularRecipeDTO
                {
                    RecipeID=g.Key.RecipeID,
                    Title = g.Key.Title,
                    RecipeIMG = !string.IsNullOrEmpty(g.Key.RecipeIMG)
                        ? $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}/Img/{g.Key.RecipeIMG}"
                        : string.Empty,
                    FavoriteCount = g.Count()
                })
                .OrderByDescending(r => r.FavoriteCount)
                .Take(10)
                .ToListAsync();

            return topFavorites;
        }





    }
}
