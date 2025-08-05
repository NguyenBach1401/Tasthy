using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.UserExerciseDTO;
using Tasthy_Backend.DTO;
namespace Tasthy_Backend.Services
{
    public interface IUserExerciseService
    {
        Task<IEnumerable<SelectedExerciseDTO>> GetAllUserExercisesAsync(int userId, DateTime date);
        Task<bool> CreateAsync(NewUserExerciseDTO dto, int userId);
        Task<bool> SavePickedExercisesAsync(List<SelectedSuggestExerciseDTO> exercises, int userId);
    }
    public class UserExerciseService : IUserExerciseService
    {
        private readonly AppDbContext _context;

        public UserExerciseService(AppDbContext context)
        { 
            _context = context;
        }
        public async Task<IEnumerable<SelectedExerciseDTO>> GetAllUserExercisesAsync(int userId, DateTime  date)
        {
            var exercises = await _context.UserExercises
                .Include(ue => ue.Exercise)
                .Where(ue => ue.UserId == userId && ue.ExerciseDate==date.Date)
                .Select(ue => new SelectedExerciseDTO
                {
                    ExerciseName=ue.Exercise.Name,
                    CaloriesPerRep = ue.Exercise.CaloriesBurnedPerRep,
                    Reps = ue.Reps,
                    Sets = ue.Sets,
                    ExerciseDate = ue.ExerciseDate
                })
                .ToListAsync();
            var customexercises = await _context.CustomExercises
                .Where(ce => ce.UserID == userId && ce.CreatedAt.Date == date.Date)
                .Select(ce => new SelectedExerciseDTO
                {
                    ExerciseName = ce.ExerciseName,
                    CaloriesPerRep = ce.CaloriesPerRep,
                    Reps = ce.Reps,
                    Sets = ce.Sets,
                    ExerciseDate = ce.CreatedAt
                })
                .ToListAsync();
            return exercises.Concat(customexercises);
        }
        public async Task<bool> CreateAsync(NewUserExerciseDTO dto, int userId)
        {
            try
            {
                var entity = new UserExercise
                {
                    UserId = userId,
                    ExerciseId = dto.ExerciseId,
                    Reps = dto.Reps,
                    Sets = dto.Sets,
                    ExerciseDate = DateTime.Now
                };

                _context.UserExercises.Add(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public async Task<bool> SavePickedExercisesAsync(List<SelectedSuggestExerciseDTO> exercises, int userId)
        {
            try
            {
                var now = DateTime.Now;
                var entities = exercises.Select(e => new UserExercise
                {
                    UserId = userId,
                    ExerciseId = e.ExerciseId,
                    Reps = e.Reps,
                    Sets = e.Sets,
                    DurationMinutes = e.DurationMinutes,
                    ExerciseDate = now
                }).ToList();

                _context.UserExercises.AddRange(entities);
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
