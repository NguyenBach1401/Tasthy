namespace Tasthy_Backend.DTO
{
    public class UserExerciseDTO
    {
        public class SelectedExerciseDTO
        {
            public string ExerciseName { get; set; }
            public double? CaloriesPerRep { get; set; }
            public int Reps { get; set; }
            public int Sets { get; set; }
            public DateTime ExerciseDate { get; set; }
        }
        public class NewUserExerciseDTO
        {
            public int ExerciseId { get; set; }
            public int Reps { get; set; }
            public int Sets { get; set; }
           
        }
        public class NewCustomExerciseDTO
        {
            public string ExerciseName { get; set; }
            public double? CaloriesPerRep { get; set; }
            public int Reps { get; set; }
            public int Sets { get; set; }
        }
        public class SelectedSuggestExerciseDTO
        {
            public int ExerciseId { get; set; }
            public int Reps { get; set; }
            public int Sets { get; set; }
            public int? DurationMinutes { get; set; }
        }

    }
}
