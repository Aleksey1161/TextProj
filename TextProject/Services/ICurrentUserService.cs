using System.ComponentModel;
using TextProject.Models;

namespace TextProject.Services
{
    public interface ICurrentUserService
    {
        bool IsAuthenticated(HttpContext httpContext);
        int? GetCurrentUserId(HttpContext httpContext);
        User? GetCurrent(HttpContext httpContext);
        void SignIn(HttpContext httpContext, int userId);
        void SignOut(HttpContext httpContext);

    }
}
