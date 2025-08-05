using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tasthy_Backend.Models
{
    public class FoodGoalSnapshot
    {
       
        public int UserId { get; set; }

       
        public DateTime LastDate { get; set; } // Ngày cuối cùng áp dụng mục tiêu này

        public double GoalCalories { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

}
