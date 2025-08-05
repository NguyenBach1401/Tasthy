namespace Tasthy_Backend.Models
{
    public class Exercise
    {
        public int ExerciseId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? DifficultyLevel { get; set; }
        public double? CaloriesBurnedPerRep { get; set; }
        public string? RecommendedFor { get; set; }
        public string? VideoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool RequiresEquipment { get; set; }
    }
}
