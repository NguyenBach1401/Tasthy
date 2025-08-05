namespace Tasthy_Backend.Models
{
 
        public class Recipe
        {
            public int RecipeID { get; set; }

            public int UserID { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public int Servings { get; set; }

            public int CookingTime { get; set; }

            public DateTime CreatedAt { get; set; } = DateTime.Now;

            public string Ingredients { get; set; }

            public string Instructions { get; set; }

            public string RecipeIMG { get; set; }
        public User User { get; set; }
        public virtual ICollection<RecipeTag> RecipeTags { get; set; } = new List<RecipeTag>();
        public virtual Nutrition? Nutritions { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }=new List<Comment>();
        
    }
}
