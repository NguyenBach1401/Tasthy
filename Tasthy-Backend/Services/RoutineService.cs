using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.RoutineDTO;

namespace Tasthy_Backend.Services
{
    public interface IRoutineService
    {
        Task<PagedResult<RoutineDto>> GetRoutinesAsync(int pageNumber, int pageSize, string? goalFilter, string? difficultyFilter);
        Task<RoutineDetailDto?> GetRoutineDetailAsync(int routineId, int userId);
    }
    public class RoutineService:IRoutineService
    {
        private readonly AppDbContext _context;

        public RoutineService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResult<RoutineDto>> GetRoutinesAsync(int pageNumber, int pageSize, string? goalFilter, string? difficultyFilter)
        {
            var query = _context.Routine.AsQueryable();
            if (!string.IsNullOrWhiteSpace(goalFilter))
            {
                query = query.Where(r => r.Goal != null && r.Goal.Contains(goalFilter));
            }

            if (!string.IsNullOrWhiteSpace(difficultyFilter))
            {
                query = query.Where(r => r.DifficultyLevel == difficultyFilter);
            }

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderBy(r => r.RoutineId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RoutineDto
                {
                    RoutineId = r.RoutineId,
                    Name = r.Name,
                    Goal = r.Goal,
                    DifficultyLevel = r.DifficultyLevel,
                    DaysPerWeek = r.DaysPerWeek,
                    DurationWeeks = r.DurationWeeks
                })
                .ToListAsync();

            return new PagedResult<RoutineDto>
            {
                TotalItems = totalItems,
                Items = items
            };
        }
        public async Task<RoutineDetailDto?> GetRoutineDetailAsync(int routineId, int userId)
        {
            var routine = await _context.Routine
                .Where(r => r.RoutineId == routineId)
                .FirstOrDefaultAsync();

            if (routine == null)
                return null;

            var routineExercises = await _context.RoutineDetails
                .Where(re => re.RoutineId == routineId)
                .Include(re => re.Exercise)
                .ToListAsync();

            var days = routineExercises
                .GroupBy(re => re.RoutineDay)
                .Select(g => new RoutineDayDto
                {
                    RoutineDay = g.Key,
                    Exercises = g.Select(re => new ExerciseInRoutineDto
                    {
                        ExerciseId = re.ExerciseId,
                        Name = re.Exercise.Name,
                        Reps = re.Reps,
                        Sets = re.Sets,
                        CaloriesPerRep = re.Exercise.CaloriesBurnedPerRep.Value,
                    }).ToList()
                }).OrderBy(d => d.RoutineDay)
                .ToList();

            var isAssigned = await _context.UserWorkoutPlan
      .AnyAsync(x => x.UserId == userId && x.RoutineId == routineId);

            return new RoutineDetailDto
            {
                RoutineId = routine.RoutineId,
                Name = routine.Name,
                Goal = routine.Goal,
                DifficultyLevel = routine.DifficultyLevel,
                DaysPerWeek = routine.DaysPerWeek,
                DurationWeeks = routine.DurationWeeks,
                Days = days,
                IsAssigned = isAssigned
            };
        }


    }
}
