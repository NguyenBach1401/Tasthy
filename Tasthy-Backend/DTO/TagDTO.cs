namespace Tasthy_Backend.DTO
{
    public class TagDTO
    {
        public int TagID { get; set; }
        public string TagName { get; set; }
        public int RecipeCount { get; set; }
    }
    public class NewTagDTO
    {
        public string TagName { get; set; }
        
    }
    public class TagPaginationDTO
    {
        public List<TagDTO> Tags { get; set; }
        public int TotalRecords { get; set; }
    }
}
