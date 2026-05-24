using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Infrastructure;
using TextProject.Services;

namespace TextProject.Pages
{
    public class ReaderModel : PageModel
    {
        private readonly ICurrentUserService _currentUserService;
        
        public ReaderModel(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        public IActionResult OnGet()
        {
            if (!_currentUserService.IsAuthenticated(HttpContext))
            {
                return RedirectToPage("/Index");
            }
            return Page();
        }
    }
}
