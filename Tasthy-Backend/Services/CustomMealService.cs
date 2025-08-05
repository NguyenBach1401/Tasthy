
using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.SelectedMealDTO;
namespace Tasthy_Backend.Services
{
    public interface ICustomMealService
    {
        Task<bool> CreateAsync(NewCustomMealDTO dto,int userId);
    }
    public class CustomMealService: ICustomMealService
    {
        private readonly AppDbContext _context;
        public CustomMealService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> CreateAsync(NewCustomMealDTO dto, int userId)
        {
            try
            {
                var meal = new CustomMeal
                {
                    UserID = userId,
                    MealName = dto.MealName,
                    Calories = dto.Calories,
                    Fat = dto.Fat,
                    Carbs = dto.Carbs,
                    Protein = dto.Protein,
                    Quantity = dto.Quantity,
                    CreatedAt = DateTime.Now
                };

                _context.CustomMeals.Add(meal);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Lấy inner exception nếu có để biết rõ nguyên nhân
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                Console.WriteLine("Error CreateAsync: " + innerMessage);

                // Ném lỗi ra tiếp để controller bắt
                throw new Exception(innerMessage);
            }

        }


    }
}
