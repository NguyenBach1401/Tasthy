using Azure;

namespace Tasthy_Backend.Models
{
    public class RecipeTag
    {
        public int RecipeID { get; set; }
        public Recipe Recipe { get; set; }

        public int TagID { get; set; }
        public Tag Tag { get; set; }
    }
}
