namespace Tasthy_Backend.Models
{
    public class Favorite
    {
        public int FavoriteID {  get; set; }
        public int UserID { get; set; }
        public int RecipeID {  get; set; }
        public DateTime CreatedAt {  get; set; }= DateTime.Now;
        public Recipe Recipe { get; set; }
    }
}

