using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.ExerciseDTO;
using Tasthy_Backend.DTO;
using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Tasthy_Backend.Services
{
    public interface IExerciseService
    {
        Task<ExercisePaginationDTO> GetAllExercisesAsync(
            int pageNumber,
            int pageSize,
            string keyword = "",
            bool? requiresEquipment = null,
            string difficultyLevel = null,
            string recommendedFor = null);
        Task<bool> CreateExerciseAsync(ExerciseCreateUpdateRequest request);
        Task<bool> UpdateExerciseAsync(int id, ExerciseCreateUpdateRequest request);
        Task<List<ExerciseSuggestDTO>> SuggestExercisesForUserAsync(
            int userId,
            bool? requiresEquipment = null,
            List<string>? muscleGroups = null,
            int limit = 20);
        Task<ExerciseSuggestDTO?> ShuffleOneExerciseWithDifficultyAsync(
             int userId,
            int currentExerciseId,
            bool? requiresEquipment = null,
            List<string>? muscleGroups = null,
            List<int>? excludeExerciseIds = null);
        Task<List<ExerciseSuggestDTO>> PickSpecificExerciseAsync(
            int userId,
            List<string> muscleGroups,
            List<int> excludeExerciseIds,
            bool? requiresEquipment = null);
    }
    public class ExerciseService:IExerciseService
    {
      
         private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;
        public ExerciseService(AppDbContext context, IConfiguration config,IWebHostEnvironment env)
        {
            _context = context;
            _config = config;
            _env = env;
        }
        public async Task<ExercisePaginationDTO> GetAllExercisesAsync(
              int pageNumber,
              int pageSize,
              string keyword = "",
              bool? requiresEquipment = null,
              string difficultyLevel = null,
              string recommendedFor = null)
        {
            var query = _context.Exercises.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(e =>
                    e.Name.ToLower().Contains(keyword) ||
                    (e.Description != null && e.Description.ToLower().Contains(keyword)));
            }

            if (requiresEquipment.HasValue)
            {
                query = query.Where(e => e.RequiresEquipment == requiresEquipment.Value);
            }

            if (!string.IsNullOrWhiteSpace(difficultyLevel))
            {
                difficultyLevel = difficultyLevel.Trim().ToLower();
                query = query.Where(e => e.DifficultyLevel.ToLower() == difficultyLevel);
            }

            if (!string.IsNullOrWhiteSpace(recommendedFor))
            {
                recommendedFor = recommendedFor.Trim().ToLower();
                query = query.Where(e => e.RecommendedFor.ToLower().Contains(recommendedFor));
            }

            var totalRecords = await query.CountAsync();

            var exercises = await query
                .OrderByDescending(e => e.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new ExercisesimpleDTO
                {
                    ExerciseId = e.ExerciseId,
                    Name = e.Name,
                    Description = e.Description,
                    DifficultyLevel = e.DifficultyLevel,
                    CaloriesBurnedPerRep = e.CaloriesBurnedPerRep,
                    RecommendedFor = e.RecommendedFor,
                    VideoUrl = e.VideoUrl,
                    RequiresEquipment = e.RequiresEquipment,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return new ExercisePaginationDTO
            {
                Exercises = exercises,
                TotalRecords = totalRecords
            };
        }


        private double ParseFlexibleDouble(string? input)
        {
            if (string.IsNullOrWhiteSpace(input)) return 0;
            input = input.Trim().Replace(',', '.');                       
            return double.TryParse(input, NumberStyles.Float,
                                   CultureInfo.InvariantCulture, out var d)
                ? d
                : 0;
        }
        public async Task<bool> CreateExerciseAsync(ExerciseCreateUpdateRequest request)
        {
            string? videoUrl = null;

            if (request.VideoUrl is { Length: > 0 })
            {
                var ext = Path.GetExtension(request.VideoUrl.FileName);
                var fileName = $"{Guid.NewGuid():N}{ext}";

                var relativeRoot = _config["VideoStorage:RelativePath"] ?? "Storage/Videos";
                var fullDir = Path.Combine(_env.ContentRootPath, relativeRoot);
                Directory.CreateDirectory(fullDir);                

                var fullPath = Path.Combine(fullDir, fileName);

                await using var fs = new FileStream(fullPath, FileMode.Create);
                await request.VideoUrl.CopyToAsync(fs);

                videoUrl = $"/videos/{fileName}";
            }
            var exercise = new Exercise
            {
                Name = request.Name,
                Description = request.Description,
                DifficultyLevel = request.DifficultyLevel,
                CaloriesBurnedPerRep = ParseFlexibleDouble(request.CaloriesBurnedPerRep),
                RecommendedFor = request.RecommendedFor,
                VideoUrl = videoUrl,
                RequiresEquipment = request.RequiresEquipment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateExerciseAsync(int id, ExerciseCreateUpdateRequest request)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null) return false;

            // 1. Nếu có video mới → lưu & xoá video cũ
            if (request.VideoUrl is { Length: > 0 })
            {
                var ext = Path.GetExtension(request.VideoUrl.FileName);
                var fileName = $"{Guid.NewGuid():N}{ext}";

                var relativeRoot = _config["VideoStorage:RelativePath"] ?? "Storage/Videos";
                var fullDir = Path.Combine(_env.ContentRootPath, relativeRoot);
                Directory.CreateDirectory(fullDir);

                var newPath = Path.Combine(fullDir, fileName);

                // copy file mới
                await using (var fs = new FileStream(newPath, FileMode.Create))
                {
                    await request.VideoUrl.CopyToAsync(fs);
                }

                // xoá file cũ (nếu có)
                if (!string.IsNullOrEmpty(exercise.VideoUrl))
                {
                    var oldPath = Path.Combine(_env.ContentRootPath, exercise.VideoUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                    if (File.Exists(oldPath))
                    {
                        File.Delete(oldPath);
                    }
                }

                // cập nhật đường dẫn
                exercise.VideoUrl = $"/videos/{fileName}";
            }

            // 2. Cập nhật các trường khác
            exercise.Name = request.Name;
            exercise.Description = request.Description;
            exercise.DifficultyLevel = request.DifficultyLevel;
            exercise.CaloriesBurnedPerRep = ParseFlexibleDouble(request.CaloriesBurnedPerRep); ;
            exercise.RecommendedFor = request.RecommendedFor;
            exercise.RequiresEquipment = request.RequiresEquipment;

            await _context.SaveChangesAsync();
            return true;
        }

        private (int reps, int sets) GenerateRepSet(float caloriesPerRep, float remainingCalories)
        {
            // Thử các combo rep/set phổ biến
            var possibleCombos = new List<(int reps, int sets)>
    {
        (10, 3), (12, 3), (15, 3), (10, 4), (12, 4), (15, 4),
        (10, 5), (12, 5)
    };

            foreach (var (reps, sets) in possibleCombos.OrderBy(x => Guid.NewGuid()))
            {
                float totalCalories = caloriesPerRep * reps * sets;
                if (totalCalories <= remainingCalories)
                {
                    return (reps, sets);
                }
            }

            // fallback nếu không có combo phù hợp
            return (10, 3);
        }

        public async Task<List<ExerciseSuggestDTO>> SuggestExercisesForUserAsync(
              int userId,
              bool? requiresEquipment = null,
              List<string>? muscleGroups = null,
              int limit = 20)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.BMR == null || user.TDEE == null)
            {
                throw new Exception("Không tìm thấy người dùng hoặc thiếu dữ liệu BMR/TDEE.");
            }

            float caloriesToBurn = user.TDEE.Value - user.BMR.Value;
            if (caloriesToBurn <= 0)
            {
                throw new Exception("Dữ liệu TDEE và BMR không hợp lệ.");
            }

            // Xác định mức độ khó phù hợp dựa trên ActivityLevel
            List<string> allowedDifficulties = new List<string> { "1", "2", "3" };
            if (!string.IsNullOrWhiteSpace(user.ActivityLevel) && int.TryParse(user.ActivityLevel, out var level) && level >= 4)
            {
                allowedDifficulties = new List<string> { "1", "2", "3", "4", "5" };
            }

            return await SuggestExercisesAsyncWithDifficultyFilter(
                caloriesToBurn,
                allowedDifficulties,
                requiresEquipment,
                muscleGroups,
                null,
                limit
            );
        }
       public async Task<List<ExerciseSuggestDTO>> SuggestExercisesAsyncWithDifficultyFilter(
                float caloriesToBurn,
                List<string> allowedDifficulties,
                bool? requiresEquipment = null,
                List<string>? muscleGroups = null,
                List<int>? excludeExerciseIds = null,
                int limit = 20)
                
    {
        var query = _context.Exercises.AsQueryable();

            if (requiresEquipment.HasValue)
            {
                query = query.Where(e => e.RequiresEquipment == requiresEquipment.Value);
            }

            if (muscleGroups != null && muscleGroups.Any())
            {
                var loweredGroups = muscleGroups.Select(g => g.Trim().ToLower()).ToList();
                query = query.Where(e => loweredGroups.Any(g =>
                    e.RecommendedFor.ToLower().Contains(g)));
            }

            if (allowedDifficulties != null && allowedDifficulties.Any())
            {
                query = query.Where(e => allowedDifficulties.Contains(e.DifficultyLevel));
            }
           
            if (excludeExerciseIds != null && excludeExerciseIds.Any())
            {
                query = query.Where(e => !excludeExerciseIds.Contains(e.ExerciseId));
            }
            var exercises = await query.ToListAsync();

            // Shuffle trước khi chọn bài
            var rnd = new Random();
            exercises = exercises.OrderBy(x => rnd.Next()).ToList();

            var result = new List<ExerciseSuggestDTO>();
        float totalCalories = 0f;

        foreach (var ex in exercises)
        {
            if (totalCalories >= caloriesToBurn) break;

            float perRep = (float)(ex.CaloriesBurnedPerRep ?? 0f);
            var (reps, sets) = GenerateRepSet(perRep, caloriesToBurn - totalCalories);
            float totalThis = perRep * reps * sets;

            if (totalThis > 0)
            {
                result.Add(new ExerciseSuggestDTO
                {
                    ExerciseId = ex.ExerciseId,
                    Name = ex.Name,
                    Description = ex.Description,
                    DifficultyLevel = ex.DifficultyLevel,
                    CaloriesBurnedPerRep = ex.CaloriesBurnedPerRep,
                    RecommendedFor = ex.RecommendedFor,
                    VideoUrl = ex.VideoUrl,
                    RequiresEquipment = ex.RequiresEquipment,
                    Reps = reps,
                    Sets = sets
                });

                totalCalories += totalThis;
            }
        }

        return result.Take(limit).ToList();
    }

        public async Task<ExerciseSuggestDTO?> ShuffleOneExerciseWithDifficultyAsync(
            int userId,
            int currentExerciseId,
            bool? requiresEquipment = null,
            List<string>? muscleGroups = null,
            List<int>? excludeExerciseIds = null)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.BMR == null || user.TDEE == null)
                throw new Exception("Không tìm thấy người dùng hoặc thiếu dữ liệu.");

            float caloriesToBurn = user.TDEE.Value - user.BMR.Value;
            List<string> allowedDifficulties = new List<string> { "1", "2", "3" };

            if (!string.IsNullOrWhiteSpace(user.ActivityLevel) &&
                int.TryParse(user.ActivityLevel, out var level) &&
                level >= 4)
            {
                allowedDifficulties = new List<string> { "1", "2", "3", "4", "5" };
            }
            excludeExerciseIds ??= new List<int>();
            if (!excludeExerciseIds.Contains(currentExerciseId))
                excludeExerciseIds.Add(currentExerciseId);

            var all = await SuggestExercisesAsyncWithDifficultyFilter(
                caloriesToBurn,
                allowedDifficulties,
                requiresEquipment,
                muscleGroups,
                limit: 100);

            var filtered = all.Where(x => !excludeExerciseIds.Contains(x.ExerciseId)).ToList();

            if (!filtered.Any())
                throw new Exception("Không tìm thấy bài tập thay thế phù hợp.");

            // Random 1 bài từ danh sách còn lại
            var random = new Random();
            var different = filtered[random.Next(filtered.Count)];
            return different;
        }

        public async Task<List<ExerciseSuggestDTO>> PickSpecificExerciseAsync(
      int userId,
      List<string> muscleGroups,
      List<int> excludeExerciseIds,
      bool? requiresEquipment = null)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.BMR == null || user.TDEE == null)
                throw new Exception("Không tìm thấy người dùng hoặc thiếu dữ liệu.");

            List<string> allowedDifficulties = new() { "1", "2", "3" };

            if (!string.IsNullOrWhiteSpace(user.ActivityLevel) &&
                int.TryParse(user.ActivityLevel, out var level) &&
                level >= 4)
            {
                allowedDifficulties = new() { "1", "2", "3", "4", "5" };
            }

            excludeExerciseIds ??= new();
            var loweredGroups = muscleGroups.Select(g => g.Trim().ToLower()).ToList();

            var query = _context.Exercises.AsQueryable();

            if (requiresEquipment.HasValue)
                query = query.Where(e => e.RequiresEquipment == requiresEquipment.Value);

            query = query.Where(e =>
                !string.IsNullOrEmpty(e.RecommendedFor) &&
                loweredGroups.Contains(e.RecommendedFor.ToLower()) &&
                allowedDifficulties.Contains(e.DifficultyLevel) &&
                !excludeExerciseIds.Contains(e.ExerciseId));

            var result = await query
                .OrderBy(e => Guid.NewGuid()) // Random hóa
                .Take(100)
                .Select(e => new ExerciseSuggestDTO
                {
                    ExerciseId = e.ExerciseId,
                    Name = e.Name,
                    Description = e.Description,
                    DifficultyLevel = e.DifficultyLevel,
                    CaloriesBurnedPerRep = e.CaloriesBurnedPerRep,
                    RecommendedFor = e.RecommendedFor,
                    VideoUrl = e.VideoUrl,
                    RequiresEquipment = e.RequiresEquipment,
                    Reps = 10,
                    Sets = 3
                })
                .ToListAsync();

            return result;
        }





    }

}

