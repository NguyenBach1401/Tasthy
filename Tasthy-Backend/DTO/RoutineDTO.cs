namespace Tasthy_Backend.DTO
{
    public class RoutineDTO
    {
        public class PagedResult<T>
        {
            public int TotalItems { get; set; }
            public IEnumerable<T> Items { get; set; } = new List<T>();
        }
        public class RoutineDto
        {
            public int RoutineId { get; set; }
            public string Name { get; set; } = null!;
            public string? Goal { get; set; }
            public string DifficultyLevel { get; set; } = null!;
            public int DaysPerWeek { get; set; }
            public int DurationWeeks { get; set; }
        }
        public class RoutineDetailDto
        {
            public int RoutineId { get; set; }
            public string Name { get; set; } = null!;
            public string? Goal { get; set; }
            public string DifficultyLevel { get; set; } = null!;
            public int DaysPerWeek { get; set; }
            public int DurationWeeks { get; set; }
            public bool IsAssigned { get; set; }    =false;

            public List<RoutineDayDto> Days { get; set; } = new();
        }

        public class RoutineDayDto
        {
            public int RoutineDay { get; set; }
            public List<ExerciseInRoutineDto> Exercises { get; set; } = new();
        }

        public class ExerciseInRoutineDto
        {
            public int ExerciseId { get; set; }
            public string Name { get; set; } = null!;
            public int Reps { get; set; }
            public int Sets { get; set; }
            public double CaloriesPerRep { get; set; }
            public double TotalCalories => Reps * Sets * CaloriesPerRep;
        }
        public class RoutineProgressDto
        {
            public int UserWorkoutPlanId { get; set; }
            public int RoutineId { get; set; }
            public int TotalDays { get; set; }
            public int DaysCheckedIn { get; set; }
            public List<RoutineDayStatusDto> DaysStatus { get; set; } = new();
        }

        public class RoutineDayStatusDto
        {
            public int Day { get; set; }
            public bool CheckedIn { get; set; }
        }
        public class RoutineFullDetailDto
        {
            public int UserWorkoutPlanId { get; set; }
            public int RoutineId { get; set; }
            public int DaysPerWeek { get; set; }
            public int DurationWeeks { get; set; }
            public int TotalDays { get; set; }
            public List<RoutineDayDetailDto> RoutineDays { get; set; } = new();
        }

        public class RoutineDayDetailDto
        {
            public int RoutineDayNumber { get; set; } // Ngày 1,2,... trong routine tổng
            public int DayOfWeek { get; set; } // Thứ mấy trong tuần (1=Thứ 2,...)
            public int WeekNumber { get; set; } // Tuần thứ mấy
            public bool IsCheckedIn { get; set; }
            public DateTime? CheckinDate { get; set; }

            public List<ExerciseInRoutineDto> Exercises { get; set; } = new();
        }
        public class UserWorkoutPlanWithProgressDto
        {
            public int UserWorkoutPlanId { get; set; }
            public string RoutineName { get; set; } = null!;
            public string Goal { get; set; } = null!;
            public string DifficultyLevel { get; set; } = null!;
            public int DurationWeeks { get; set; }
            public int DaysPerWeek { get; set; }
            public DateTime StartDate { get; set; }
            public int CurrentDay { get; set; }

            public int TotalDays { get; set; }
            public int DaysCheckedIn { get; set; }
            public double ProgressPercent { get; set; } // % hoàn thành
        }


    }
}
