using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Models;
using Tasthy_Backend.Services;
using Tasthy_Backend.DTO;
using static Tasthy_Backend.DTO.TagDTO;
using Microsoft.AspNetCore.Authorization;
namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTags([FromQuery] string keyword = "")
        {
            var tags = await _tagService.GetTagsAsync(keyword);
            return Ok(tags);
        }
        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> GetAllTags([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string keyword = "")
        {
            var tags = await _tagService.GetAllTagsAsync(pageNumber, pageSize, keyword);
            return Ok(tags);
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateTag([FromBody] NewTagDTO tagName)
        {
            var tag = await _tagService.CreateTagAsync(tagName);
            return CreatedAtAction(nameof(GetTags), new { keyword = tag.TagName }, tag);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTag(int id, [FromBody] NewTagDTO newTagName)
        {
            var success = await _tagService.UpdateTagAsync(id, newTagName);
            if (!success) return NotFound();
            return Ok(success);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var success = await _tagService.DeleteTagAsync(id);
            if (!success) return NotFound();
            return Ok(success);
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetTopTags()
        {
            try
            {
                var topTags = await _tagService.GetTop6MostUsedTagsAsync();
                return Ok(topTags);
            }
            catch (Exception ex)
            {
                // Log lỗi nếu cần
                return StatusCode(500, "Đã xảy ra lỗi khi lấy danh sách tag phổ biến.");
            }
        }

    }
}
