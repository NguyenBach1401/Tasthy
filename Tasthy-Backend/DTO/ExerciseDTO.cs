namespace Tasthy_Backend.DTO
{
    public class ExerciseDTO
    {
        public class ExercisesimpleDTO
        {
            public int ExerciseId { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? DifficultyLevel { get; set; }
            public double? CaloriesBurnedPerRep { get; set; }
            public string? RecommendedFor { get; set; }
            public string? VideoUrl { get; set; }
            public bool RequiresEquipment { get; set; }
            public DateTime CreatedAt { get; set; }
        }
        public class ExercisePaginationDTO
        {
            public List<ExercisesimpleDTO> Exercises { get; set; }
            public int TotalRecords { get; set; }
        }


        public class ExerciseCreateUpdateRequest
        {
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? DifficultyLevel { get; set; }
            public string? CaloriesBurnedPerRep { get; set; }
            public string? RecommendedFor { get; set; }
            public IFormFile? VideoUrl { get; set; }
            public bool RequiresEquipment { get; set; }
        }

        public class ExerciseSuggestDTO
        {
            public int ExerciseId { get; set; }
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; }
            public string? DifficultyLevel { get; set; }
            public double? CaloriesBurnedPerRep { get; set; }
            public string? RecommendedFor { get; set; }
            public string? VideoUrl { get; set; }
            public bool RequiresEquipment { get; set; }

            public int Reps { get; set; }
            public int Sets { get; set; }
        }
    }
}
