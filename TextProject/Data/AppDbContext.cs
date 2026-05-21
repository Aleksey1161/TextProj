using Microsoft.EntityFrameworkCore;
using TextProject.Models;

namespace TextProject.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<SpeechLog> SpeechLogs { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext>options) : base(options)
        {

        }


    }
}
