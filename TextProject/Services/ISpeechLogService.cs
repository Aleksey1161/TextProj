using TextProject.Models;

namespace TextProject.Services
{
    public interface ISpeechLogService
    {
        List<SpeechLog> GetAllLogs();
        List<SpeechLog> GetLogsByUserId(int userId);
        void AddLog(SpeechLog log);


    }
}
