using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using static Tasthy_Backend.DTO.UserDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Runtime.Intrinsics.X86;
using Tasthy_Backend.DTO;

namespace Tasthy_Backend.Services
{
    public interface IUserService
    {
        Task<bool> Register(UserRegisterRequest request);
        Task<UserResponse?> Login(UserLoginRequest request);
        Task<UserProfileDTO?> GetUserProfile(int userId);
        Task<bool> UpdateUserProfile(int userId, UpdateUserProfile request);
        Task<UserPaginationDTO> GetAllUsersAsync(
                  int pageNumber,
                  int pageSize,
                  string keyword = "",
                  string gender = "",
                  string activityLevel = "");
        Task<bool> DeleteUserAsync(int userId);
        Task<UserHealthSummaryDTO> GetUserHealthInfoAsync(int userId);
    }
    public class UserService: IUserService 
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;
        public UserService(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        public async Task<bool> Register(UserRegisterRequest request)
        {
            // Kiểm tra nếu email hoặc username đã tồn tại
            if (_context.Users.Any(u => u.Email == request.Email || u.UserName == request.UserName))
                return false;

            // Mã hóa mật khẩu
            var passwordHash = HashPassword(request.Password);

            var newUser = new User
            {
                UserName = request.UserName,
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role="User",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<UserResponse?> Login(UserLoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);

            if (user == null)
            {
                return null;
            }
            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                throw new Exception("Password hash is missing.");
            }
            if (!VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid password.");
            }
            var token = _jwtService.GenerateToken(user);

            return new UserResponse
            {
                UserID=user.UserID,
                UserName = user.UserName,
                Token = token,
                Role=user.Role,
            };
            ;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashBytes);
            }
        }
        private bool VerifyPassword(string password, string storedHash)
        {
            var hash = HashPassword(password);
            return hash == storedHash;
        }
        public async Task<UserProfileDTO?> GetUserProfile(int userId)
        {
            var user = await _context.Users
                .Where(u => u.UserID == userId)
                .Select(u => new UserProfileDTO
                {
                    UserID = u.UserID,
                    Name = u.Name,
                    Email = u.Email,
                    Age = u.Age,
                    Gender = u.Gender,
                    HeightCm = u.HeightCm,
                    WeightKg = u.WeightKg,
                    ActivityLevel = u.ActivityLevel,
                    Goal = u.Goal,
                    BMI = u.BMI,
                    BMR = u.BMR,
                    TDEE = u.TDEE
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
               throw new Exception("User not found.");
            }
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

                user.CaloriesGoal = user.TDEE.Value * multiplier;
            }
            else
            {
                user.CaloriesGoal = null;
            }
            return user;
        }
        public async Task<bool> UpdateUserProfile(int userId, UpdateUserProfile request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Lưu các giá trị cũ trước khi thay đổi
            float? oldTDEE = user.TDEE;
            float? oldBMR = user.BMR;
            string oldGoal = user.Goal;

            // Chỉ lưu snapshot nếu đủ thông tin cũ
            if (oldTDEE.HasValue && oldBMR.HasValue && !string.IsNullOrEmpty(oldGoal))
            {
                // Tính GoalBurn = (TDEE - BMR) * 0.35
                float oldGoalBurn = (oldTDEE.Value - oldBMR.Value) * 0.35f;

                // Tính GoalCalories từ Goal
                float multiplier = oldGoal switch
                {
                    "1" => 0.75f,
                    "2" => 0.85f,
                    "3" => 1.0f,
                    "4" => 1.15f,
                    "5" => 1.25f,
                    _ => 1.0f
                };
                float oldGoalCalories = oldTDEE.Value * multiplier;

                var snapshotDate = DateTime.Today.AddDays(-1);

                _context.FoodGoalSnapshot.Add(new FoodGoalSnapshot
                {
                    UserId = userId,
                    LastDate = snapshotDate,
                    GoalCalories = oldGoalCalories,
                    CreatedAt = DateTime.Now
                });

                _context.ExerciseGoalSnapshot.Add(new ExerciseGoalSnapshot
                {
                    UserId = userId,
                    LastDate = snapshotDate,
                    GoalBurn = oldGoalBurn,
                    CreatedAt = DateTime.Now
                });
            }

            // Kiểm tra email nếu thay đổi
            if (!string.IsNullOrEmpty(request.Email))
            {
                var emailExists = await _context.Users
                    .AnyAsync(u => u.Email == request.Email && u.UserID != userId);
                if (emailExists)
                {
                    throw new ArgumentException("Email đã tồn tại.");
                }

                user.Email = request.Email;
            }

            // Cập nhật các trường khác
            user.Name = request.Name;
            user.Age = request.Age;
            user.Gender = request.Gender;
            user.HeightCm = request.HeightCm;
            user.WeightKg = request.WeightKg;
            user.ActivityLevel = request.ActivityLevel;
            user.Goal = request.Goal;

            // Tính BMI
            float height = user.HeightCm.Value;
            float weight = user.WeightKg.Value;
            user.BMI = (float?)(weight / Math.Pow(height / 100.0, 2));

            // Tính BMR
            int age = user.Age.Value;
            double bmr;
            if (user.Gender?.ToLower() == "nam")
            {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            }
            else
            {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            user.BMR = (float?)bmr;

            // Tính TDEE
            double activityFactor = user.ActivityLevel switch
            {
                "1" => 1.2,
                "2" => 1.375,
                "3" => 1.55,
                "4" => 1.725,
                "5" => 1.9,
                _ => 1.2
            };
            user.TDEE = (float?)(bmr * activityFactor);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<UserPaginationDTO> GetAllUsersAsync(
                 int pageNumber,
                 int pageSize,
                 string keyword = "",
                 string gender = "",
                 string activityLevel = "")
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(u =>
                    u.UserName.ToLower().Contains(keyword) ||
                    u.Name.ToLower().Contains(keyword) ||
                    u.Email.ToLower().Contains(keyword));
            }

            if (!string.IsNullOrWhiteSpace(gender))
            {
                gender = gender.Trim().ToLower();
                query = query.Where(u => u.Gender.ToLower() == gender);
            }

            if (!string.IsNullOrWhiteSpace(activityLevel))
            {
                activityLevel = activityLevel.Trim().ToLower();
                query = query.Where(u => u.ActivityLevel.ToLower() == activityLevel);
            }

            var totalRecords = await query.CountAsync();

            var users = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserProfileDTO
                {
                    UserID = u.UserID,
                    Name = u.Name,
                    Email = u.Email,
                    Age = u.Age,
                    Gender = u.Gender,
                    HeightCm = u.HeightCm,
                    WeightKg = u.WeightKg,
                    Goal = u.Goal,
                    ActivityLevel = u.ActivityLevel,
                    BMI = u.BMI,
                    BMR = u.BMR,
                    TDEE = u.TDEE
                })
                .ToListAsync();

            return new UserPaginationDTO
            {
                Users = users,
                TotalRecords = totalRecords
            };
        }


        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<UserHealthSummaryDTO> GetUserHealthInfoAsync(int userId)
        {
            var systemMealsCount = await _context.SelectedMeals
                .Where(sm => sm.UserID == userId)
                .CountAsync();

            var customMealsCount = await _context.CustomMeals
                .Where(cm => cm.UserID == userId)
                .CountAsync();

            var systemExercisesCount = await _context.UserExercises
                .Where(ue => ue.UserId == userId)
                .CountAsync();

            var customExercisesCount = await _context.CustomExercises
                .Where(ce => ce.UserID == userId)
                .CountAsync();

            return new UserHealthSummaryDTO
            {
                TotalSystemMeals = systemMealsCount,
                TotalCustomMeals = customMealsCount,
                TotalSystemExercises = systemExercisesCount,
                TotalCustomExercises = customExercisesCount
            };
        }

    }
}
