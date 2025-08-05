using Tasthy_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Tasthy_Backend.Data;
using Microsoft.AspNetCore.Http;
using static Tasthy_Backend.DTO.TagDTO;
using Tasthy_Backend.DTO;
namespace Tasthy_Backend.Services
{
    public interface ITagService
    {
        Task<List<TagDTO>> GetTagsAsync(string keyword = "");
        Task<TagPaginationDTO> GetAllTagsAsync(int pageNumber, int pageSize, string keyword = "");
        Task<TagDTO> CreateTagAsync(NewTagDTO tagName);
        Task<bool> UpdateTagAsync(int tagId,NewTagDTO newTagName);
        Task<bool> DeleteTagAsync(int tagId);
        Task<List<TagDTO>> GetTop6MostUsedTagsAsync();
    }
    public class TagService:ITagService
    {
        private readonly AppDbContext _context;

        public TagService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<TagDTO>> GetTagsAsync(string keyword = "")
        {
            var query = _context.Tags.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(t => t.TagName.ToLower().Contains(keyword));
            }

            var result = await query
                .OrderBy(t => t.TagName)
                .Select(t => new TagDTO
                {
                    TagID = t.TagID,
                    TagName = t.TagName
                })
                .ToListAsync();

            return result;
        }
        public async Task<TagPaginationDTO> GetAllTagsAsync(int pageNumber, int pageSize, string keyword = "")
        {
            var query = _context.Tags.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(t => t.TagName.ToLower().Contains(keyword));
            }

            var totalRecords = await query.CountAsync();

            var result = await query
                .OrderBy(t => t.TagName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TagDTO
                {
                    TagID = t.TagID,
                    TagName = t.TagName,
                    RecipeCount = _context.RecipeTags
                .Where(rt => rt.TagID == t.TagID)
                .Select(rt => rt.RecipeID)
                .Distinct()
                .Count()
                })
                .ToListAsync();

            return new TagPaginationDTO
            {
                Tags = result,
                TotalRecords = totalRecords
            };
        }


        public async Task<TagDTO> CreateTagAsync(NewTagDTO newTagDTO)
        {
            var tagName = newTagDTO?.TagName?.Trim();

            if (string.IsNullOrEmpty(tagName))
                throw new ArgumentException("Tag name is required.");

            var newTag = new Tag
            {
                TagName = tagName
            };

            _context.Tags.Add(newTag);
            await _context.SaveChangesAsync();

            return new TagDTO
            {
                TagID = newTag.TagID,
                TagName = newTag.TagName
            };
        }
        public async Task<bool> UpdateTagAsync(int tagId, NewTagDTO newTagDTO)
        {
            var tag = await _context.Tags.FindAsync(tagId);
            if (tag == null) return false;

            var trimmedTagName = newTagDTO?.TagName?.Trim();
            if (string.IsNullOrEmpty(trimmedTagName))
                throw new ArgumentException("Tag name cannot be empty.");

            tag.TagName = trimmedTagName;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTagAsync(int tagId)
        {
           
            var relatedRecipeTags = await _context.RecipeTags
                .Where(rt => rt.TagID == tagId)
                .ToListAsync();

            if (relatedRecipeTags.Any())
            {
                _context.RecipeTags.RemoveRange(relatedRecipeTags);
            }

           
            var tag = await _context.Tags.FindAsync(tagId);
            if (tag == null) return false;

            _context.Tags.Remove(tag);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TagDTO>> GetTop6MostUsedTagsAsync()
        {
            var result = await _context.RecipeTags
                .GroupBy(rt => new { rt.TagID, rt.Tag.TagName })
                .Select(g => new TagDTO
                {
                    TagID = g.Key.TagID,
                    TagName = g.Key.TagName,
                    RecipeCount = g.Select(rt => rt.RecipeID).Distinct().Count()
                })
                .OrderByDescending(t => t.RecipeCount)
                .Take(6)
                .ToListAsync();

            return result;
        }


    }
}
