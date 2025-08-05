using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.SelectedMealDTO;
using Microsoft.AspNetCore.Http;

namespace Tasthy_Backend.Services
{
    public interface ISelectedMealService
    {
        Task<IEnumerable<UserMealDTO>> GetAllAsync(int userId, DateTime date);
        Task<bool> CreateAsync(NewSelectedMealDTO dto);
    }
    public class SelectedMealService:ISelectedMealService
    {
        private readonly AppDbContext _context;

        public SelectedMealService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<UserMealDTO>> GetAllAsync(int userId, DateTime date)
        {
            var selectedMealData = await _context.SelectedMeals
                .Include(sm => sm.Recipe)
                .ThenInclude(r => r.Nutritions)
                .Where(sm => sm.UserID == userId && sm.SelectedAt.Date == date.Date)
                .Select(sm => new UserMealDTO
                {
                    Name = sm.Recipe.Title,
                    Calories = (float)(sm.Recipe.Nutritions.Calories),
                    Fat = (float)(sm.Recipe.Nutritions.Fat),
                    Carbs = (float)(sm.Recipe.Nutritions.Carbs),
                    Protein = (float)(sm.Recipe.Nutritions.Protein),
                    Quantity = sm.NoRecipe,
                    CreateAt = sm.SelectedAt
                })
                .ToListAsync();

            var customMealData = await _context.CustomMeals
                .Where(cm => cm.UserID == userId && cm.CreatedAt.Date == date.Date)
                .Select(cm => new UserMealDTO
                {
                    Name = cm.MealName,
                    Calories = (float)(cm.Calories),
                    Fat = (float)(cm.Fat),
                    Carbs = (float)(cm.Carbs),
                    Protein = (float)(cm.Protein),
                    Quantity = cm.Quantity,
                    CreateAt = cm.CreatedAt
                })
                .ToListAsync();

            return selectedMealData.Concat(customMealData);
        }

        public async Task<bool> CreateAsync(NewSelectedMealDTO dto)
        {
            try
            {
                var meal = new SelectedMeal
                {
                    UserID = dto.UserID,
                    RecipeID = dto.RecipeID,
                    NoRecipe = dto.NoRecipe,
                    SelectedAt = DateTime.Now
                };

                _context.SelectedMeals.Add(meal);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}
