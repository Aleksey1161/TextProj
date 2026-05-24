using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using TextProject.Services;

namespace TextProject.Controllers
{
    public class AdminLogsControllers : Controller
    {

        public readonly ISpeechLogService _speechLogService;
        private readonly ICurrentUserService _currentUserService;
        public AdminLogsControllers(ISpeechLogService speechLogService,ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
            _speechLogService = speechLogService;
        }
        public IActionResult Index()
        {
            if (!_currentUserService.IsAuthenticated(HttpContext))
            {
                return RedirectToPage("/Index");
            }
            var log = _speechLogService.GetAllLogs();
            return View(log);
        }
    }
}
