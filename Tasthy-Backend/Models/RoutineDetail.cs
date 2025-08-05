namespace Tasthy_Backend.Models
{
    public class RoutineDetail
    {
        public int RoutineDetailId { get; set; }
        public int RoutineId { get; set; }
        public int RoutineDay { get; set; }
        public int ExerciseId { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }

        public Routine Routine { get; set; } = null!;
        public Exercise Exercise { get; set; } = null!;
    }
}
