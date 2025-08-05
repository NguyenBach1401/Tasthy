namespace Tasthy_Backend.Models
{
    public class Comment
    {
        public int CommentID { get; set; }
        public int RecipeID { get; set; }
        public int UserID { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }= DateTime.Now;
        public User User { get; set; }
    }
}
