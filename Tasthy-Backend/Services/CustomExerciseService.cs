
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.UserExerciseDTO;
using Tasthy_Backend.DTO;
using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Models;

namespace Tasthy_Backend.Services
{
    public interface ICustomExerciseService
    {
        Task<bool> CreateAsync(NewCustomExerciseDTO dto, int userId);
    }
    public class CustomExerciseService:ICustomExerciseService
    {
        private readonly AppDbContext _context;
        public CustomExerciseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateAsync(NewCustomExerciseDTO dto, int userId)
        {
            try
            {
                var exer = new CustomExercise
                {
                    UserID = userId,
                    ExerciseName=dto.ExerciseName,
                    CaloriesPerRep=dto.CaloriesPerRep,
                    Reps=dto.Reps,
                    Sets=dto.Sets,
                    CreatedAt=DateTime.Now,

                };

                _context.CustomExercises.Add(exer);
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
