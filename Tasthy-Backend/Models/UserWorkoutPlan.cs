namespace Tasthy_Backend.Models
{
    public class UserWorkoutPlan
    {
        public int UserWorkoutPlanId { get; set; }
        public int UserId { get; set; }
        public int RoutineId { get; set; }
        public DateTime StartDate { get; set; }
        public int CurrentDay { get; set; }

        public Routine Routine { get; set; } = null!;
        public ICollection<UserRoutineCheckin> UserRoutineCheckins { get; set; } = new List<UserRoutineCheckin>();
    }
}
