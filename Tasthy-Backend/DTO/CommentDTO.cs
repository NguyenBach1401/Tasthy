namespace Tasthy_Backend.DTO
{
    public class CommentDTO
    {
        public class AddCommentRequest
        {
            public int UserId { get; set; }
            public int RecipeId { get; set; }
            public string Content { get; set; }
        }
        public class DeleteCommentRequest
        {
            public int CommentId { get; set; }
            public int UserId { get; set; }
        }
        public class UpdateCommentRequest
        {
            public int CommentId { get; set; }
            public int UserId { get; set; }
            public string newContent { get; set; }
        }
        public class CommentResultDTO
        {
            public List<CommentsimpleDTO> Comments { get; set; }
            public int TotalComments { get; set; }
        }
        public class CommentsimpleDTO
        {
            public int CommentID { get; set; }
            public string Name { get; set; }
            public string UserName { get; set; }
            public string Content { get; set; }
            public DateTime CreatedAt { get; set; }
        }

    }
}
