using System.ComponentModel.DataAnnotations;

namespace Tasthy_Backend.Models
{
    public class CustomMeal
    {
        [Key]
        public int CustomMealID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        public string MealName { get; set; }

        public double Calories { get; set; }
        public double Fat { get; set; }
        public double Carbs { get; set; }
        public double Protein { get; set; }


        [Required]
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
