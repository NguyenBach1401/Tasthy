using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using Microsoft.AspNetCore.Mvc;
using static Tasthy_Backend.DTO.RecipeDTO;
using static Tasthy_Backend.DTO.CommentDTO;
namespace Tasthy_Backend.Services
{
    public interface ICommentService
    {
        Task<CommentResultDTO> GetCommentsByRecipeId(int recipeId, int commentPage = 1, int pageSize = 5);
        Task<CommentsimpleDTO> AddCommentAsync(int userId, int recipeId, string content);
        Task<bool> DeleteCommentAsync(int commentId, int userId);
        Task<bool> UpdateCommentAsync(int commentId, int userId, string newContent);
    }
    public class CommentService:ICommentService
    {
        private readonly AppDbContext _context;

        public CommentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CommentsimpleDTO> AddCommentAsync(int userId, int recipeId, string content)
        {
            var comment = new Comment
            {
                UserID = userId,
                RecipeID = recipeId,
                Content = content,
                CreatedAt = DateTime.Now
            };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return new CommentsimpleDTO
            {
                Name = user?.Name ?? "Unknown",
                UserName=user?.UserName ?? "Unknown",
                Content = content,
                CreatedAt = comment.CreatedAt
            };
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int userId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.CommentID == commentId && c.UserID == userId);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateCommentAsync(int commentId, int userId, string newContent)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.CommentID == commentId && c.UserID == userId);
            if (comment != null)
            {
                comment.Content = newContent;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<CommentResultDTO> GetCommentsByRecipeId(int recipeId, int commentPage = 1, int pageSize = 5)
        {
            var commentsQuery = _context.Comments
                .Where(c => c.RecipeID == recipeId)
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt);

            var totalComments = await commentsQuery.CountAsync();

            var comments = await commentsQuery
                .Skip((commentPage - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CommentsimpleDTO
                {
                    CommentID = c.CommentID,
                    Name = c.User.Name,
                    UserName = c.User.UserName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return new CommentResultDTO
            {
                Comments = comments,
                TotalComments = totalComments
            };
        }

    }
}
