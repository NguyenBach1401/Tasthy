using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tasthy_Backend.Models
{
    public class SelectedMeal
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MealID { get; set; }
        [Required]
        public int UserID { get; set; }
        [Required]
        public int RecipeID { get; set; }
        public DateTime SelectedAt { get; set; }
        public int NoRecipe { get; set; }
        public Recipe Recipe { get; set; }
    }
}
