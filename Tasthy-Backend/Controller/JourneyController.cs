using Microsoft.AspNetCore.Mvc;
using Tasthy_Backend.Services;

namespace Tasthy_Backend.Controller
{
    [ApiController]
    [Route("api/journey")]
    public class JourneyController : ControllerBase
    {
        private readonly IJourneyService _journeyService;

        public JourneyController(IJourneyService journeyService)
        {
            _journeyService = journeyService;
        }

        [HttpGet("food")]
        public async Task<IActionResult> GetFoodJourney([FromQuery] int userId, [FromQuery] int month, [FromQuery] int year)
        {
            var data = await _journeyService.GetFoodJourneyAsync(userId, month, year);
            return Ok(data);
        }

        [HttpGet("workout")]
        public async Task<IActionResult> GetWorkoutJourney([FromQuery] int userId, [FromQuery] int month, [FromQuery] int year)
        {
            var data = await _journeyService.GetWorkoutJourneyAsync(userId, month, year);
            return Ok(data);
        }
    }
}
