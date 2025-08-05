using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.RoutineDTO;
using static Tasthy_Backend.Services.UserWorkoutPlanService;

namespace Tasthy_Backend.Services
{
    public interface IUserWorkoutPlanService
    {
        Task<IEnumerable<object>> GetUserWorkoutPlansAsync(int userId);
        Task<bool> AssignRoutineAsync(int userId, int routineId);
        Task<CheckinResult> CheckinRoutineAsync(int userWorkoutPlanId);
        Task<RoutineProgressDto> GetRoutineProgressAsync(int userWorkoutPlanId);
        Task<RoutineFullDetailDto?> GetRoutineFullDetailAsync(int userWorkoutPlanId);
        Task<(List<UserWorkoutPlanWithProgressDto> Items, int TotalCount)> GetUserWorkoutPlansWithProgressAsync(
      int userId,
      int pageNumber,
      int pageSize,
      string? goal = null,
      string? difficultyLevel = null,
      bool? isComplete = null);
    }

    public class UserWorkoutPlanService : IUserWorkoutPlanService
    {
        private readonly AppDbContext _context;
        public enum CheckinResult
        {
            Success,
            PlanNotFound,
            AlreadyCheckedInToday,
            NoExercisesForNextDay
        }

        public UserWorkoutPlanService(AppDbContext context) 
        {

            _context = context;
        }
        public async Task<IEnumerable<object>> GetUserWorkoutPlansAsync(int userId)
        {
            return await _context.UserWorkoutPlan
                .Where(p => p.UserId == userId)
                .Include(p => p.Routine)
                .Select(p => new
                {
                    p.UserWorkoutPlanId,
                    p.Routine.Name,
                    p.Routine.Goal,
                    p.Routine.DifficultyLevel,
                    p.Routine.DurationWeeks,
                    p.Routine.DaysPerWeek,
                    p.StartDate,
                    p.CurrentDay
                }).ToListAsync();
        }

        public async Task<bool> AssignRoutineAsync(int userId, int routineId)
        {
            var alreadyExists = await _context.UserWorkoutPlan
                .AnyAsync(x => x.UserId == userId && x.RoutineId == routineId);

            if (alreadyExists) return false;

            var newPlan = new UserWorkoutPlan
            {
                UserId = userId,
                RoutineId = routineId,
                StartDate = DateTime.Today,
                CurrentDay = 1
            };

            _context.UserWorkoutPlan.Add(newPlan);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CheckinResult> CheckinRoutineAsync(int userWorkoutPlanId)
        {
            var plan = await _context.UserWorkoutPlan
                .Include(p => p.Routine)
                .FirstOrDefaultAsync(p => p.UserWorkoutPlanId == userWorkoutPlanId);

            if (plan == null)
                return CheckinResult.PlanNotFound;

            var hasCheckedInToday = await _context.UserRoutineCheckin
                .AnyAsync(c => c.UserWorkoutPlanId == userWorkoutPlanId && c.CheckinDate == DateTime.Today);

            if (hasCheckedInToday)
                return CheckinResult.AlreadyCheckedInToday;

            // Danh sách các ngày đã check-in của plan này
            var existingDays = await _context.UserRoutineCheckin
                .Where(c => c.UserWorkoutPlanId == userWorkoutPlanId)
                .Select(c => c.RoutineDay)
                .ToListAsync();

            // Tìm ngày tiếp theo (theo thứ tự kế hoạch toàn bộ)
            int fullRoutineDay = 1;
            while (existingDays.Contains(fullRoutineDay))
            {
                fullRoutineDay++;
            }

            // Nếu đã vượt quá số ngày kế hoạch cho phép (DaysOfWeek * DurationWeeks) thì không cho check-in nữa
            int totalPlanDays = plan.Routine.DaysPerWeek * plan.Routine.DurationWeeks;
            if (fullRoutineDay > totalPlanDays)
                return CheckinResult.NoExercisesForNextDay;

            // Tính ngày trong tuần lặp lại
            int dayOfWeek = (fullRoutineDay - 1) % plan.Routine.DaysPerWeek + 1;

            // Lấy bài tập của ngày đó
            var routineExercises = await _context.RoutineDetails
                .Where(e => e.RoutineId == plan.RoutineId && e.RoutineDay == dayOfWeek)
                .ToListAsync();

            if (!routineExercises.Any())
                return CheckinResult.NoExercisesForNextDay;

            // Ghi nhận check-in
            _context.UserRoutineCheckin.Add(new UserRoutineCheckin
            {
                UserWorkoutPlanId = plan.UserWorkoutPlanId,
                RoutineDay = fullRoutineDay, // vẫn lưu ngày tổng để biết tiến độ
                CheckinDate = DateTime.Today
            });

            // Thêm bài tập đã thực hiện hôm nay
            foreach (var ex in routineExercises)
            {
                _context.UserExercises.Add(new UserExercise
                {
                    UserId = plan.UserId,
                    ExerciseId = ex.ExerciseId,
                    Reps = ex.Reps,
                    Sets = ex.Sets,
                    DurationMinutes = 0,
                    ExerciseDate = DateTime.Today
                });
            }

            plan.CurrentDay = fullRoutineDay;

            await _context.SaveChangesAsync();
            return CheckinResult.Success;
        }


        public async Task<RoutineProgressDto> GetRoutineProgressAsync(int userWorkoutPlanId)
        {
            var plan = await _context.UserWorkoutPlan
                .Include(p => p.Routine)
                .FirstOrDefaultAsync(p => p.UserWorkoutPlanId == userWorkoutPlanId);

            if (plan == null) return null!;

            int totalDays = plan.Routine.DaysPerWeek * plan.Routine.DurationWeeks;

            var checkedDays = await _context.UserRoutineCheckin
                .Where(c => c.UserWorkoutPlanId == userWorkoutPlanId)
                .Select(c => c.RoutineDay)
                .ToListAsync();

            var progressList = new List<RoutineDayStatusDto>();
            for (int day = 1; day <= totalDays; day++)
            {
                progressList.Add(new RoutineDayStatusDto
                {
                    Day = day,
                    CheckedIn = checkedDays.Contains(day)
                });
            }

            return new RoutineProgressDto
            {
                UserWorkoutPlanId = userWorkoutPlanId,
                RoutineId = plan.RoutineId,
                TotalDays = totalDays,
                DaysCheckedIn = checkedDays.Count,
                DaysStatus = progressList
            };
        }
        public async Task<RoutineFullDetailDto?> GetRoutineFullDetailAsync(int userWorkoutPlanId)
        {
            var plan = await _context.UserWorkoutPlan
                .Include(p => p.Routine)
                .FirstOrDefaultAsync(p => p.UserWorkoutPlanId == userWorkoutPlanId);

            if (plan == null) return null;

            var daysPerWeek = plan.Routine.DaysPerWeek;
            var durationWeeks = plan.Routine.DurationWeeks;
            int totalDays = daysPerWeek * durationWeeks;

            // Lấy tất cả các ngày trong tuần routine tập (ví dụ Thứ 2,4,6)
            // Giả sử lưu ở RoutineDetails để lấy distinct routineDay cho routine đó
            var routineDaysInWeek = await _context.RoutineDetails
                .Where(d => d.RoutineId == plan.RoutineId)
                .Select(d => d.RoutineDay)
                .Distinct()
                .OrderBy(d => d)
                .ToListAsync();

            // Lấy danh sách ngày đã checkin của người dùng
            var checkinMap = await _context.UserRoutineCheckin
      .Where(c => c.UserWorkoutPlanId == userWorkoutPlanId)
      .ToDictionaryAsync(c => c.RoutineDay, c => c.CheckinDate);


            var detailList = new List<RoutineDayDetailDto>();

            // Duyệt từng ngày trong tổng số ngày routine (ví dụ 12)
            for (int i = 0; i < totalDays; i++)
            {
                // Tính ngày trong tuần tương ứng:
                // routineDaysInWeek = [2,4,6] (ví dụ)
                // i = 0 → weekIndex=0, dayOfWeek = 2
                int weekIndex = i / daysPerWeek; // tuần thứ mấy, 0-based
                int dayOfWeekIndex = i % daysPerWeek; // chỉ số ngày trong tuần (0..daysPerWeek-1)
                int routineDay = routineDaysInWeek[dayOfWeekIndex]; // ví dụ 2 (Thứ 2)

                // Tổng số ngày thực tế của routine (i+1)
                int routineDayNumber = i + 1;

                // Lấy các bài tập của routine cho ngày đó
                var exercises = await _context.RoutineDetails
                    .Where(d => d.RoutineId == plan.RoutineId && d.RoutineDay == routineDay)
                    .Select(d => new ExerciseInRoutineDto
                    {
                        ExerciseId = d.ExerciseId,
                        Name = d.Exercise.Name,
                        Reps = d.Reps,
                        Sets = d.Sets,
                        CaloriesPerRep= d.Exercise.CaloriesBurnedPerRep.Value,                  
                    })
                    .ToListAsync();

                detailList.Add(new RoutineDayDetailDto
                {
                    RoutineDayNumber = routineDayNumber,
                    DayOfWeek = routineDay,
                    WeekNumber = weekIndex + 1,
                    IsCheckedIn = checkinMap.ContainsKey(routineDayNumber),
                    CheckinDate = checkinMap.ContainsKey(routineDayNumber) ? checkinMap[routineDayNumber] : null,
                    Exercises = exercises
                });
            }

            return new RoutineFullDetailDto
            {
                UserWorkoutPlanId = userWorkoutPlanId,
                RoutineId = plan.RoutineId,
                DaysPerWeek = daysPerWeek,
                DurationWeeks = durationWeeks,
                TotalDays = totalDays,
                RoutineDays = detailList
            };
        }
        public async Task<(List<UserWorkoutPlanWithProgressDto> Items, int TotalCount)> GetUserWorkoutPlansWithProgressAsync(
             int userId,
             int pageNumber,
             int pageSize,
             string? goal = null,
             string? difficultyLevel = null,
             bool? isComplete = null)
        {
            // Lấy query cơ bản lọc theo userId
            var query = _context.UserWorkoutPlan
                .Where(p => p.UserId == userId)
                .OrderByDescending(p=>p.UserWorkoutPlanId)
                .Include(p => p.Routine)
                .AsQueryable();

            // Áp filter goal nếu có
            if (!string.IsNullOrWhiteSpace(goal))
            {
                query = query.Where(p => p.Routine.Goal == goal);
            }

            // Áp filter difficultyLevel nếu có
            if (!string.IsNullOrWhiteSpace(difficultyLevel))
            {
                query = query.Where(p => p.Routine.DifficultyLevel == difficultyLevel);
            }

            var plans = await query.ToListAsync();

            var userWorkoutPlanIds = plans.Select(p => p.UserWorkoutPlanId).ToList();

            // Lấy tổng số ngày đã checkin cho từng plan
            var checkins = await _context.UserRoutineCheckin
                .Where(c => userWorkoutPlanIds.Contains(c.UserWorkoutPlanId))
                .GroupBy(c => c.UserWorkoutPlanId)
                .Select(g => new
                {
                    UserWorkoutPlanId = g.Key,
                    CheckedDaysCount = g.Count()
                })
                .ToListAsync();

            var tempResults = new List<UserWorkoutPlanWithProgressDto>();

            foreach (var plan in plans)
            {
                int totalDays = plan.Routine.DaysPerWeek * plan.Routine.DurationWeeks;
                int daysCheckedIn = checkins.FirstOrDefault(c => c.UserWorkoutPlanId == plan.UserWorkoutPlanId)?.CheckedDaysCount ?? 0;
                double progressPercent = totalDays == 0 ? 0 : (daysCheckedIn * 100.0 / totalDays);

                tempResults.Add(new UserWorkoutPlanWithProgressDto
                {
                    UserWorkoutPlanId = plan.UserWorkoutPlanId,
                    RoutineName = plan.Routine.Name,
                    Goal = plan.Routine.Goal,
                    DifficultyLevel = plan.Routine.DifficultyLevel,
                    DurationWeeks = plan.Routine.DurationWeeks,
                    DaysPerWeek = plan.Routine.DaysPerWeek,
                    StartDate = plan.StartDate,
                    CurrentDay = plan.CurrentDay,
                    TotalDays = totalDays,
                    DaysCheckedIn = daysCheckedIn,
                    ProgressPercent = Math.Round(progressPercent, 2)
                });
            }

            // Lọc theo isComplete nếu có
            if (isComplete.HasValue)
            {
                if (isComplete.Value)
                    tempResults = tempResults.Where(r => r.DaysCheckedIn >= r.TotalDays).ToList();
                else
                    tempResults = tempResults.Where(r => r.DaysCheckedIn < r.TotalDays).ToList();
            }

            int totalCount = tempResults.Count;

            // Áp phân trang
            var pagedResults = tempResults
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return (pagedResults, totalCount);
        }



    }
}
