using System.ComponentModel.DataAnnotations;

namespace Tasthy_Backend.Models
{
    public class UserExercise
    {
       
        [Key]
        public int UserExerciseId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int ExerciseId { get; set; }

        public int? DurationMinutes { get; set; }

        public int Reps { get; set; }

        public int Sets { get; set; }

        public DateTime ExerciseDate { get; set; }

           
        public Exercise Exercise { get; set; }
        

    }
}
