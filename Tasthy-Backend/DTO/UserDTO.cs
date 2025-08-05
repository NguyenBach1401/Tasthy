namespace Tasthy_Backend.DTO
{
    public class UserDTO
    {
        public class UserRegisterRequest
        {
            public string UserName { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Role {  get; set; }
        }

        public class UserLoginRequest
        {
            public string UserName { get; set; }
            public string Password { get; set; }
        }
        public class UserResponse
        {
            public int UserID { get; set; }
            public string UserName{get; set;}
            public string Token { get; set; } = null!;
            public string Role {  get; set; }
        }
        public class UserProfileDTO
        {
            public int UserID { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public int? Age { get; set; }
            public string? Gender { get; set; }
            public int? HeightCm { get; set; } 
            public float? WeightKg { get; set; } 
            public string? ActivityLevel { get; set; }
            public string? Goal { get; set; }
            public float? BMI { get; set; } 
            public float? BMR { get; set; } 
            public float? TDEE { get; set; } 
            public float? CaloriesGoal { get; set; }
        }
        public class UpdateUserProfile
        {
            public string Email { get; set;}
            public string Name { get; set; }
            public int? Age { get; set; }
            public string? Gender { get; set; }
            public int? HeightCm { get; set; }
            public int? WeightKg { get; set; }
            public string? ActivityLevel { get; set; }
            public string? Goal { get; set; }
        }
        public class UserPaginationDTO
        {
            public List<UserProfileDTO> Users { get; set; }
            public int TotalRecords { get; set; }
        }
        public class UserHealthSummaryDTO
        {
            public int TotalSystemMeals { get; set; }
            public int TotalCustomMeals { get; set; }
            public int TotalSystemExercises { get; set; }
            public int TotalCustomExercises { get; set; }
        }
    }
}
