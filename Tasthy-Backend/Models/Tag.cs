namespace Tasthy_Backend.Models
{
    public class Tag
    {
        public int TagID { get; set; }
        public string TagName { get; set; }

        public virtual ICollection<RecipeTag> RecipeTags { get; set; } = new List<RecipeTag>();
    }
}
