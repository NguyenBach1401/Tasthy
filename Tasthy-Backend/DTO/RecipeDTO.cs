using static Tasthy_Backend.DTO.CommentDTO;

namespace Tasthy_Backend.DTO
{
    public class RecipeDTO
    {
        public class RecipeSimpleDTO
        {
            public int RecipeID { get; set; }
            public string Title { get; set; }
            public int Servings { get;set; }
            public int CookingTime { get; set; }
            public string? RecipeIMG { get; set; }
        }
        public class RecipePaginationDTO
        {
            public List<RecipeSimpleDTO> Recipes { get; set; }
            public int TotalRecords { get; set; }
        }

        public class RicipeFavoriteDTO
        {
            public List<RecipeFavorDTO> RecipeFavors { get; set; }
            public int TotalRecipes { get; set; }
        }
        public class RecipeFavorDTO
        {
            public string Title { get; set; }
            public string? RecipeIMG { get; set; }
            public int Servings {  get; set; }
            public int CookingTime {  get; set; }
        }
        public class RecipeCreateDTO
        {
            public int UserID { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public int Servings { get; set; }
            public int CookingTime { get; set; }
            public string Ingredients { get; set; }
            public string Instructions { get; set; }

            // Thêm tags
            public List<string> Tags { get; set; } = new();

            // Thêm dinh dưỡng
            public NutritionCreateDTO? Nutrition { get; set; }
        }

        public class RecipeManageDTO
        {
            public int RecipeID { get; set; }
            public string UserName { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public int Servings { get; set; }
            public int CookingTime { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Ingredients { get; set; }
            public string Instructions { get; set; }
            public string RecipeIMG { get; set; }
        

            public List<string> Tags { get; set; }
            public NutritionDTO? Nutrition { get; set; }

        }
        public class RecipeDetailDTO
        {
            public int RecipeID { get; set; }
            public string UserName { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public int Servings { get; set; }
            public int CookingTime { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Ingredients { get; set; }
            public string Instructions { get; set; }
            public string RecipeIMG { get; set; }
            public bool IsFavor { get; set; } = false;
           
            public List<string> Tags { get; set; }
            public NutritionDTO? Nutrition { get; set; }
         
        }

        public class NutritionDTO
        {
            public float Calories { get; set; }
            public float Protein { get; set; }
            public float Carbs { get; set; }
            public float Fat { get; set; }
        }
        public class NutritionCreateDTO
        {
            public string? Calories { get; set; }
            public string? Protein { get; set; }
            public string? Carbs { get; set; }
            public string? Fat { get; set; }
        }
        public class RecipeUpdateRequest
        {
            public string Title { get; set; }
            public string? Description { get; set; }
            public int? Servings { get; set; }
            public int? CookingTime { get; set; }
            public string? Ingredients { get; set; }
            public string? Instructions { get; set; }


            public List<string>? TagNames { get; set; }


            public string? Calories { get; set; }
            public string? Protein { get; set; }
            public string? Carbs { get; set; }
            public string? Fat { get; set; }

        }

        public class PopularRecipeDTO
        {
            public int RecipeID { get; set; }
            public string Title { get; set; }
            public string RecipeIMG { get; set; }
            public int FavoriteCount { get; set; }
        }



    }
}
