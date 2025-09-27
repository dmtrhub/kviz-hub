using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Entities.Users;
using KvizHub.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Infrastructure.Data;

public class DataSeeder
{
    private readonly ApplicationDbContext _context;

    public DataSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        if (await _context.Users.AnyAsync())
            return; // već postoji inicijalni data

        // --- Korisnici ---
        var admin = new User
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@test.com",
            Role = UserRole.Admin,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!")
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "user1",
            Email = "user1@test.com",
            Role = UserRole.User,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!")
        };

        await _context.Users.AddRangeAsync(admin, user);

        // --- Kategorije ---
        var catProg = new Category { Name = "Programiranje", Description = "Opis programerske kategorije" };
        var catHistory = new Category { Name = "Istorija", Description = "Opis istorijske kategorije" };
        await _context.Categories.AddRangeAsync(catProg, catHistory);

        // --- Kvizovi ---
        var quiz1 = new Quiz
        {
            Title = "C# Osnove",
            Description = "Osnovna pitanja o C# jeziku",
            Difficulty = Difficulty.Easy,
            TimeLimit = 10,
            Questions = new List<Question>(),
            QuizCategories = new List<QuizCategory>
            {
                new QuizCategory { Category = catProg }
            }
        };

        var quiz2 = new Quiz
        {
            Title = "Istorija Srbije",
            Description = "Pitanja iz srpske istorije",
            Difficulty = Difficulty.Medium,
            TimeLimit = 15,
            Questions = new List<Question>(),
            QuizCategories = new List<QuizCategory>
            {
                new QuizCategory { Category = catHistory }
            }
        };

        await _context.Quizzes.AddRangeAsync(quiz1, quiz2);

        // --- Pitanja i opcije ---
        var q1 = new Question
        {
            Text = "Koja je glavna razlika između class i struct u C#?",
            Type = QuestionType.SingleChoice,
            Points = 5,
            Quiz = quiz1,
            AnswerOptions = new List<AnswerOption>
            {
                new AnswerOption { Text = "Class je reference type, struct je value type", IsCorrect = true },
                new AnswerOption { Text = "Class je value type, struct je reference type", IsCorrect = false },
                new AnswerOption { Text = "Nema razlike", IsCorrect = false },
                new AnswerOption { Text = "Struct ne može imati metode", IsCorrect = false }
            }
        };

        var q2 = new Question
        {
            Text = "Koji je prvi vladar Srbije?",
            Type = QuestionType.SingleChoice,
            Points = 5,
            Quiz = quiz2,
            AnswerOptions = new List<AnswerOption>
            {
                new AnswerOption { Text = "Stefan Nemanja", IsCorrect = true },
                new AnswerOption { Text = "Knez Lazar", IsCorrect = false },
                new AnswerOption { Text = "Vuk Karadžić", IsCorrect = false },
                new AnswerOption { Text = "Petar II Petrović Njegoš", IsCorrect = false }
            }
        };

        await _context.Questions.AddRangeAsync(q1, q2);

        await _context.SaveChangesAsync();
    }
}