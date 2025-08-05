using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Tasthy_Backend.Models
{
    public class ExerciseGoalSnapshot
    {  
        public int UserId { get; set; }
        public DateTime LastDate { get; set; }

        public double GoalBurn { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation (tùy chọn)
        public User User { get; set; }
    }

}
