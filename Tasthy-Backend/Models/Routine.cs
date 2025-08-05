namespace Tasthy_Backend.Models
{
    public class Routine
    {
        public int RoutineId { get; set; }
        public string Name { get; set; } = null!;
        public string? Goal { get; set; }
        public string DifficultyLevel { get; set; } = null!;
        public int DaysPerWeek { get; set; }
        public int DurationWeeks { get; set; }
    }
}
