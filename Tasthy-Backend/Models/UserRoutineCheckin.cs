using System.ComponentModel.DataAnnotations;

namespace Tasthy_Backend.Models
{
    public class UserRoutineCheckin
    {
        [Key]
        public int CheckinId { get; set; }
        [Required]
        public int UserWorkoutPlanId { get; set; }
        public int RoutineDay { get; set; }
        public DateTime CheckinDate { get; set; }
    }
}
