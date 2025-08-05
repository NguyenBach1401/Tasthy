using Microsoft.EntityFrameworkCore;
using Tasthy_Backend.Data;
using Tasthy_Backend.Models;

namespace Tasthy_Backend.Services
{
    public class DailyStatusDto
    {
        public string Date { get; set; } 
        public string Status { get; set; }
        public double? Target { get; set; }
    }

    public interface IJourneyService
    {
        Task<List<DailyStatusDto>> GetFoodJourneyAsync(int userId, int month, int year);
        Task<List<DailyStatusDto>> GetWorkoutJourneyAsync(int userId, int month, int year);
    }
    public class JourneyService :IJourneyService
    {
        private readonly AppDbContext _context;

        public JourneyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DailyStatusDto>> GetFoodJourneyAsync(int userId, int month, int year)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return new List<DailyStatusDto>();

            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            // Lấy snapshot gần nhất mà Date >= currentDate (tức là áp dụng cho các ngày <= Date đó)
            var foodSnapshots = await _context.FoodGoalSnapshot
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.LastDate)
                .ToListAsync();

            // Lấy dữ liệu từ SelectedMeals
            var meals = await _context.SelectedMeals
                .Include(m => m.Recipe)
                    .ThenInclude(r => r.Nutritions)
                .Where(m => m.UserID == userId && m.SelectedAt >= startDate && m.SelectedAt <= endDate)
                .GroupBy(m => m.SelectedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalCalories = g.Sum(m => (float)(m.NoRecipe * m.Recipe.Nutritions.Calories))

                })
                .ToListAsync();

            // Lấy dữ liệu từ CustomMeals
            var customMeals = await _context.CustomMeals
                .Where(m => m.UserID == userId && m.CreatedAt >= startDate && m.CreatedAt <= endDate)
                .GroupBy(m => m.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalCalories = g.Sum(m => (float)(m.Calories * m.Quantity))
                })
                .ToListAsync();

            // Tổng hợp tổng calories theo ngày
            var dailyCalories = new Dictionary<DateTime, double>();

            foreach (var item in meals)
            {
                dailyCalories[item.Date] = (float)(item.TotalCalories);
            }

            foreach (var item in customMeals)
            {
                if (dailyCalories.ContainsKey(item.Date))
                    dailyCalories[item.Date] += (item.TotalCalories);
                else
                    dailyCalories[item.Date] =(item.TotalCalories);
            }

            // Tính kết quả theo từng ngày
            var result = new List<DailyStatusDto>();

            for (int day = 1; day <= endDate.Day; day++)
            {
                var date = new DateTime(year, month, day);
                dailyCalories.TryGetValue(date, out double total);
                string status = "none";

                // Tìm snapshot có Date >= currentDate (áp dụng cho currentDate trở về trước)
                var snapshot = foodSnapshots.FirstOrDefault(s => s.LastDate >= date);
                double? goal = snapshot != null ? (double?)snapshot.GoalCalories : null;


                if (!goal.HasValue)
                {
                    // Tính toán goal theo user hiện tại
                    if (user.TDEE.HasValue && !string.IsNullOrEmpty(user.Goal))
                    {
                        float multiplier = user.Goal switch
                        {
                            "1" => 0.75f,
                            "2" => 0.85f,
                            "3" => 1.0f,
                            "4" => 1.15f,
                            "5" => 1.25f,
                            _ => 1.0f
                        };
                        goal = user.TDEE.Value * multiplier;
                    }
                }

                if (goal.HasValue && total > 0)
                {
                    double lower = goal.Value * 0.85f;
                    double upper = goal.Value * 1.15f;

                    status = (total >= lower && total <= upper) ? "success" : "fail";
                }

                result.Add(new DailyStatusDto
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Status = status,
                    Target= goal,
                });
            }

            return result;
        }


        public async Task<List<DailyStatusDto>> GetWorkoutJourneyAsync(int userId, int month, int year)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserID == userId);
            if (user == null || !user.TDEE.HasValue || !user.BMR.HasValue)
                return new List<DailyStatusDto>();

            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            // Lấy các snapshot của người dùng
            var snapshots = await _context.ExerciseGoalSnapshot
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.LastDate)
                .ToListAsync();

            // Dữ liệu bài tập hệ thống
            var exercises = await _context.UserExercises
                .Where(e => e.UserId == userId && e.ExerciseDate >= startDate && e.ExerciseDate <= endDate)
                .Include(e => e.Exercise)
                .ToListAsync();

            var systemDailyBurn = exercises
                .GroupBy(e => e.ExerciseDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalCalories = g.Sum(x => x.Exercise.CaloriesBurnedPerRep * x.Reps * x.Sets)
                });

            // Dữ liệu bài tập custom
            var customExercises = await _context.CustomExercises
                .Where(c => c.UserID == userId && c.CreatedAt >= startDate && c.CreatedAt <= endDate)
                .ToListAsync();

            var customDailyBurn = customExercises
                .GroupBy(c => c.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalCalories = g.Sum(x => x.CaloriesPerRep * x.Reps * x.Sets)
                });

            // Gộp lại dữ liệu calo theo ngày
            var dailyBurnDict = new Dictionary<DateTime, float>();

            foreach (var item in systemDailyBurn)
                dailyBurnDict[item.Date] = (float)(item.TotalCalories);

            foreach (var item in customDailyBurn)
            {
                if (dailyBurnDict.ContainsKey(item.Date))
                    dailyBurnDict[item.Date] += (float)(item.TotalCalories);
                else
                    dailyBurnDict[item.Date] = (float)(item.TotalCalories);
            }

            // Trả kết quả theo từng ngày
            var result = new List<DailyStatusDto>();

            for (int day = 1; day <= endDate.Day; day++)
            {
                var date = new DateTime(year, month, day);
                dailyBurnDict.TryGetValue(date, out float total);

                // Tìm snapshot áp dụng cho ngày này
                var snapshot = snapshots.FirstOrDefault(s => s.LastDate >= date);
                double? goal = snapshot?.GoalBurn;

                if (!goal.HasValue)
                {
                    // Tính lại theo thông tin hiện tại nếu không có snapshot
                    goal = (user.TDEE.Value - user.BMR.Value) * 0.35f;
                }

                string status = "none";
                if (goal.HasValue && total > 0)
                {
                    status = total >= goal.Value * 0.8f ? "success" : "fail";
                }

                result.Add(new DailyStatusDto
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Status = status,
                    Target = goal
                });
            }

            return result;
        }



    }
}
