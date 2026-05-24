namespace TextProject.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Login { get; set; } = string.Empty;
        public string HashPassword { get; set; } = string.Empty;        
        public string Name { get; set; } = string.Empty;

        public List<SpeechLog> SpeechLogs { get; set; } = new();
        public string PasswordHash { get; internal set; }
    }
}
