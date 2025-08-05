using System;
using System.ComponentModel.DataAnnotations;

namespace YourNamespace.Models
{
    public class CustomExercise
    {
        [Key]
        public int CustomExerciseID { get; set; }

        [Required]
        public int UserID { get; set; }
        public string ExerciseName {  get; set; }

        public double? CaloriesPerRep { get; set; }

        
        public int Reps { get; set; }

        
        public int Sets { get; set; }

        
        public DateTime CreatedAt { get; set; }
    }
}
