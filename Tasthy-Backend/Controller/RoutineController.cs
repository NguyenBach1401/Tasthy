using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Services;

namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutinesController : ControllerBase
    {
        private readonly IRoutineService _routineService;

        public RoutinesController(IRoutineService routineService)
        {
            _routineService = routineService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoutines(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? goal = null,
            [FromQuery] string? difficulty = null)
        {
            var result = await _routineService.GetRoutinesAsync(pageNumber, pageSize, goal, difficulty);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoutineDetail(int id,int userId)
        {
            var result = await _routineService.GetRoutineDetailAsync(id,userId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

    }
}
