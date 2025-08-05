using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Models;
using Tasthy_Backend.Services;
using Tasthy_Backend.DTO;
using  static Tasthy_Backend.DTO.CommentDTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }
        [HttpGet("comments/{recipeId}")]
        public async Task<IActionResult> GetComments(int recipeId, int commentPage = 1, int pageSize = 5)
        {
            var result = await _commentService.GetCommentsByRecipeId(recipeId, commentPage, pageSize);
            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddComment([FromBody] AddCommentRequest request)
        {
            var comment = await _commentService.AddCommentAsync(request.UserId,request.RecipeId,request.Content);
            return Ok(comment);
        }
        [HttpPut("update")]
        public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentRequest request)
        {
            var updatecomment=await _commentService.UpdateCommentAsync(request.CommentId, request.UserId, request.newContent);
            return Ok(updatecomment);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteComment (int commentId, int userId)
        {
            var delcomment=await _commentService.DeleteCommentAsync(commentId,userId);
            return Ok(delcomment);
        }
    }
}
