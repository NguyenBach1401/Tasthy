namespace Tasthy_Backend.DTO
{
    public class SelectedMealDTO
    {
        public class UserMealDTO
        {
            public string Name { get; set; }
            public float Calories { get; set; }

            public float Fat { get; set; }

            public float Carbs { get; set; }

            public float Protein { get; set; }
            public int Quantity {  get; set; }
            public DateTime CreateAt { get; set; }
        }
        public class NewSelectedMealDTO
        {
            public int UserID { get; set; }
            public int RecipeID { get; set; }
            public int NoRecipe { get; set; }

        }
        public class NewCustomMealDTO
        {
           
            public string MealName { get; set; }
            public double Calories { get; set; }
            public double Fat { get; set; }
            public double Carbs { get; set; }
            public double Protein { get; set; }
            public int Quantity { get; set; }
        }

    }
}
