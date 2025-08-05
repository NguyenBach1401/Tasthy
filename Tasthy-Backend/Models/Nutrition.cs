namespace Tasthy_Backend.Models
{
    public class Nutrition
    {
        public int NutritionsID { get; set; }
        public int RecipeID { get; set; }

        public float Calories { get; set; }
        public float Protein { get; set; }
        public float Carbs { get; set; }
        public float Fat { get; set; }
    }
}
