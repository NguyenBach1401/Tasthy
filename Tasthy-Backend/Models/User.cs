namespace Tasthy_Backend.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public int? HeightCm { get; set; }
        public float? WeightKg { get; set; }
        public string? ActivityLevel { get; set; }
        public string? Goal { get; set; }
        public DateTime CreatedAt { get; set; }
        public float? BMI { get; set; }
        public float? BMR { get; set; }
        public float? TDEE { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
