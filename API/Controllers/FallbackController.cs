using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        //nếu không tìm thấy route nào thì trả về file index.html
        public IActionResult Index()
        {
            return new PhysicalFileResult(Path.Combine(Directory.GetCurrentDirectory(),
             "wwwroot", "index.html"), "text/HTML");
        }
    }
}