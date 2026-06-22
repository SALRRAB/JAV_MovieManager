using Microsoft.AspNetCore.Mvc;
using MovieManager.BusinessLogic;
using MovieManager.ClassLibrary.RequestBody;

namespace MovieManager.Endpoint.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImageController : Controller
    {
        private string notFoundMessage = "No Image found!";
        private MovieService _movieService;
        private ActorService _actorService;
        private ImageCacheService _imageCacheService;

        public ImageController(
            MovieService movieService,
            ActorService actorService,
            ImageCacheService imageCacheService)
        {
            _movieService = movieService;
            _actorService = actorService;
            _imageCacheService = imageCacheService;
        }

        [HttpPost] 
        [Route("/images/getimage")]
        public IActionResult GetImage([FromBody] ImageRequest imageRequest)
        {
            var path = "";
            if (imageRequest.ImageType < 10)
            {
                path = _movieService.GetImagePath(imageRequest);
            }
            else if (imageRequest.ImageType >= 10)
            {
                path = _actorService.GetImagePath(imageRequest);
            }
            if (string.IsNullOrEmpty(path))
            {
                return NotFound(notFoundMessage);
            }

            // Serve from local cache to avoid repeated reads from library/network paths.
            var cachedPath = _imageCacheService.GetCachedImagePath(imageRequest, path);
            if (string.IsNullOrEmpty(cachedPath) || !System.IO.File.Exists(cachedPath))
            {
                return NotFound(notFoundMessage);
            }

            var image = System.IO.File.OpenRead(cachedPath);
            return File(image, "image/jpeg");
        }
    }
}
