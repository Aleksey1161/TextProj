using Microsoft.EntityFrameworkCore;
using TextProject.Data;
using TextProject.Models;

namespace TextProject.Services
{
    public class SpeechLogService: ISpeechLogService
    {
        private readonly AppDbContext _context;
        public SpeechLogService(AppDbContext context)
        {
            _context = context;
        }
        public List<SpeechLog> GetAllLogs()
        {
            return _context.SpeechLogs
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt)
                .ToList();
        }
        public List<SpeechLog> GetLogsByUserId(int userId)
        {
            return _context.SpeechLogs
                .Include(l => l.User)
                .Where(l => l.User.Id == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToList();
        }
        public void AddLog(SpeechLog log)
        {
            _context.SpeechLogs.Add(log);
            _context.SaveChanges();
        }
    }
}
