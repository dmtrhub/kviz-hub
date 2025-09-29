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
        try
        {
            Console.WriteLine("🔍 Checking if database is ready...");

            // PROVERA 1: Može li se konektovati na bazu
            if (!await _context.Database.CanConnectAsync())
            {
                Console.WriteLine("❌ Cannot connect to database. Skipping seed.");
                return;
            }

            // PROVERA 2: Da li baza već ima podatke
            if (await _context.Users.AnyAsync())
            {
                Console.WriteLine("✅ Database already has data. Skipping seed.");
                return;
            }

            Console.WriteLine("🌱 Starting database seed...");

            // --- Korisnici ---
            var users = new List<User>
        {
            new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                Email = "admin@kvizhub.com",
                Role = UserRole.Admin,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            },
            new User
            {
                Id = Guid.NewGuid(),
                Username = "user",
                Email = "dmtr@kvizhub.com",
                Role = UserRole.User,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
            },
            new User
            {
                Id = Guid.NewGuid(),
                Username = "dmtr",
                Email = "dmtr@kvizhub.com",
                Role = UserRole.User,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
            },
            new User
            {
                Id = Guid.NewGuid(),
                Username = "marija",
                Email = "marija@kvizhub.com",
                Role = UserRole.User,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
            }
        };

            await _context.Users.AddRangeAsync(users);

            // --- Kategorije ---
            var categories = new List<Category>
        {
            new Category { Name = "Programiranje", Description = "Pitanja iz svijeta programiranja i IT-a" },
            new Category { Name = "Istorija", Description = "Istorijske ličnosti, događaji i periodi" },
            new Category { Name = "Geografija", Description = "Zemlje, gradovi, rijeke i planine" },
            new Category { Name = "Nauka", Description = "Fizika, hemija, biologija i astronomija" },
            new Category { Name = "Sport", Description = "Sportska takmičenja i pravila" },
            new Category { Name = "Film i TV", Description = "Filmovi, serije i glumci" },
            new Category { Name = "Muzika", Description = "Muzički žanrovi, izvođači i instrumenti" }
        };

            await _context.Categories.AddRangeAsync(categories);

            // --- Kvizovi ---
            var quizzes = new List<Quiz>
        {
            new Quiz
            {
                Title = "C# Programiranje - Osnove",
                Description = "Testirajte svoje znanje osnovnih koncepata C# programskog jezika",
                Difficulty = Difficulty.Easy,
                TimeLimit = 10,
            },
            new Quiz
            {
                Title = "Istorija Srbije",
                Description = "Pitanja iz bogate istorije Srbije od srednjeg vijeka do danas",
                Difficulty = Difficulty.Medium,
                TimeLimit = 15,
            },
            new Quiz
            {
                Title = "Geografija Evrope",
                Description = "Prepoznajte evropske zemlje, gradove i geografske karakteristike",
                Difficulty = Difficulty.Easy,
                TimeLimit = 12,
            },
            new Quiz
            {
                Title = "JavaScript - Napredni koncepti",
                Description = "Izazovni kviz o naprednim JavaScript konceptima i patternima",
                Difficulty = Difficulty.Hard,
                TimeLimit = 20,
            },
            new Quiz
            {
                Title = "Olimpijske igre",
                Description = "Sve o olimpijskim igrama, sportovima i rekordima",
                Difficulty = Difficulty.Medium,
                TimeLimit = 15,
            }
        };

            await _context.Quizzes.AddRangeAsync(quizzes);

            // --- Povezivanje kvizova sa kategorijama ---
            var quizCategories = new List<QuizCategory>
        {
            new QuizCategory { Quiz = quizzes[0], Category = categories[0] }, // C# - Programiranje
            new QuizCategory { Quiz = quizzes[1], Category = categories[1] }, // Istorija Srbije - Istorija
            new QuizCategory { Quiz = quizzes[2], Category = categories[2] }, // Geografija Evrope - Geografija
            new QuizCategory { Quiz = quizzes[3], Category = categories[0] }, // JavaScript - Programiranje
            new QuizCategory { Quiz = quizzes[4], Category = categories[4] }  // Olimpijske igre - Sport
        };

            await _context.QuizCategories.AddRangeAsync(quizCategories);

            // --- Pitanja i opcije za C# kviz ---
            var csharpQuestions = new List<Question>
        {
            new Question
            {
                Text = "Koja je glavna razlika između class i struct u C#?",
                Type = QuestionType.SingleChoice,
                Points = 5,
                Quiz = quizzes[0],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Class je reference type, struct je value type", IsCorrect = true },
                    new AnswerOption { Text = "Class je value type, struct je reference type", IsCorrect = false },
                    new AnswerOption { Text = "Nema razlike", IsCorrect = false },
                    new AnswerOption { Text = "Struct ne može imati metode", IsCorrect = false }
                }
            },
            new Question
            {
                Text = "Šta je nullable type u C#?",
                Type = QuestionType.SingleChoice,
                Points = 5,
                Quiz = quizzes[0],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Tip koji može imati vrijednost null", IsCorrect = true },
                    new AnswerOption { Text = "Tip koji ne može biti null", IsCorrect = false },
                    new AnswerOption { Text = "Tip koji se koristi samo u bazama podataka", IsCorrect = false },
                    new AnswerOption { Text = "Tip koji automatski baca exception", IsCorrect = false }
                }
            },
            new Question
            {
                Text = "Koje od sljedećih su prednosti korištenja Entity Frameworka?",
                Type = QuestionType.MultipleChoice,
                Points = 10,
                Quiz = quizzes[0],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Smanjuje količinu SQL koda koji treba napisati", IsCorrect = true },
                    new AnswerOption { Text = "Poboljšava performanse u odnosu na raw SQL", IsCorrect = false },
                    new AnswerOption { Text = "Omogućava lakšu migraciju baze podataka", IsCorrect = true },
                    new AnswerOption { Text = "Automatski generiše sve potrebne stored procedure", IsCorrect = false }
                }
            }
        };

            // --- Pitanja i opcije za Istorija kviz ---
            var historyQuestions = new List<Question>
        {
            new Question
            {
                Text = "Koji je prvi vladar iz dinastije Nemanjić?",
                Type = QuestionType.SingleChoice,
                Points = 5,
                Quiz = quizzes[1],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Stefan Nemanja", IsCorrect = true },
                    new AnswerOption { Text = "Stefan Prvovenčani", IsCorrect = false },
                    new AnswerOption { Text = "Stefan Dušan", IsCorrect = false },
                    new AnswerOption { Text = "Stefan Dečanski", IsCorrect = false }
                }
            },
            new Question
            {
                Text = "Kada je održana Bitka na Kosovu?",
                Type = QuestionType.SingleChoice,
                Points = 5,
                Quiz = quizzes[1],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "1389. godine", IsCorrect = true },
                    new AnswerOption { Text = "1241. godine", IsCorrect = false },
                    new AnswerOption { Text = "1456. godine", IsCorrect = false },
                    new AnswerOption { Text = "1526. godine", IsCorrect = false }
                }
            },
            new Question
            {
                Text = "Koji su od navedenih bili srpski vladari?",
                Type = QuestionType.MultipleChoice,
                Points = 10,
                Quiz = quizzes[1],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Karađorđe Petrović", IsCorrect = true },
                    new AnswerOption { Text = "Miloš Obrenović", IsCorrect = true },
                    new AnswerOption { Text = "Ivo Andrić", IsCorrect = false },
                    new AnswerOption { Text = "Petar II Petrović Njegoš", IsCorrect = true }
                }
            }
        };

            // --- Pitanja i opcije za Geografija kviz ---
            var geographyQuestions = new List<Question>
        {
            new Question
            {
                Text = "Koji je glavni grad Španije?",
                Type = QuestionType.SingleChoice,
                Points = 5,
                Quiz = quizzes[2],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Madrid", IsCorrect = true },
                    new AnswerOption { Text = "Barcelona", IsCorrect = false },
                    new AnswerOption { Text = "Valencia", IsCorrect = false },
                    new AnswerOption { Text = "Sevilja", IsCorrect = false }
                }
            },
            new Question
            {
                Text = "Koje planine se nalaze na granici između Evrope i Azije?",
                Type = QuestionType.SingleChoice,
                Points = 5,
                Quiz = quizzes[2],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Ural", IsCorrect = true },
                    new AnswerOption { Text = "Alpi", IsCorrect = false },
                    new AnswerOption { Text = "Kavkaz", IsCorrect = false },
                    new AnswerOption { Text = "Balkan", IsCorrect = false }
                }
            }
        };

            // --- Pitanja i opcije za JavaScript kviz ---
            var jsQuestions = new List<Question>
        {
            new Question
            {
                Text = "Šta je closure u JavaScriptu?",
                Type = QuestionType.SingleChoice,
                Points = 10,
                Quiz = quizzes[3],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Funkcija sa pristupom vanjskom scope-u", IsCorrect = true },
                    new AnswerOption { Text = "Način za zatvaranje browser tab-a", IsCorrect = false },
                    new AnswerOption { Text = "Tip podatka za čuvanje tajni", IsCorrect = false },
                    new AnswerOption { Text = "Metoda za zaustavljanje event loop-a", IsCorrect = false }
                }
            },
            new Question
            {
                Text = "Koje od navedenih su JavaScript framework-ovi?",
                Type = QuestionType.MultipleChoice,
                Points = 15,
                Quiz = quizzes[3],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "React", IsCorrect = true },
                    new AnswerOption { Text = "Vue", IsCorrect = true },
                    new AnswerOption { Text = "Angular", IsCorrect = true },
                    new AnswerOption { Text = "Django", IsCorrect = false }
                }
            }
        };

            // --- Pitanja i opcije za Sport kviz ---
            var sportQuestions = new List<Question>
        {
            new Question
            {
                Text = "Gde su održane prve moderne Olimpijske igre?",
                Type = QuestionType.SingleChoice,
                Points = 5,
                Quiz = quizzes[4],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Atina, Grčka", IsCorrect = true },
                    new AnswerOption { Text = "Rim, Italija", IsCorrect = false },
                    new AnswerOption { Text = "Pariz, Francuska", IsCorrect = false },
                    new AnswerOption { Text = "London, Engleska", IsCorrect = false }
                }
            },
            new Question
            {
                Text = "Koje od navedenih sportova su uključeni u moderne petoboj?",
                Type = QuestionType.MultipleChoice,
                Points = 10,
                Quiz = quizzes[4],
                AnswerOptions = new List<AnswerOption>
                {
                    new AnswerOption { Text = "Mačevanje", IsCorrect = true },
                    new AnswerOption { Text = "Trčanje", IsCorrect = true },
                    new AnswerOption { Text = "Plivanje", IsCorrect = true },
                    new AnswerOption { Text = "Streličarstvo", IsCorrect = false },
                    new AnswerOption { Text = "Jahanje", IsCorrect = true },
                    new AnswerOption { Text = "Streljaštvo", IsCorrect = true }
                }
            }
        };

            // --- Dodavanje svih pitanja ---
            var allQuestions = csharpQuestions
                .Concat(historyQuestions)
                .Concat(geographyQuestions)
                .Concat(jsQuestions)
                .Concat(sportQuestions)
                .ToList();

            await _context.Questions.AddRangeAsync(allQuestions);

            // --- Rezultati kvizova ---
            var quizAttempts = new List<QuizAttempt>
        {
            new QuizAttempt
            {
                User = users[1], // marko
                Quiz = quizzes[0],
                Score = 15,
                StartedAt = DateTime.UtcNow.AddDays(-1).AddHours(-2),
                FinishedAt = DateTime.UtcNow.AddDays(-1).AddHours(-1),
                UserAnswers = new List<UserAnswer>()
            },
            new QuizAttempt
            {
                User = users[2], // ana
                Quiz = quizzes[1],
                Score = 15,
                StartedAt = DateTime.UtcNow.AddDays(-2).AddHours(-3),
                FinishedAt = DateTime.UtcNow.AddDays(-2).AddHours(-2),
                UserAnswers = new List<UserAnswer>()
            },
            new QuizAttempt
            {
                User = users[1], // marko
                Quiz = quizzes[2],
                Score = 10,
                StartedAt = DateTime.UtcNow.AddDays(-3).AddHours(-1),
                FinishedAt = DateTime.UtcNow.AddDays(-3),
                UserAnswers = new List<UserAnswer>()
            },
            new QuizAttempt
            {
                User = users[3], // petar
                Quiz = quizzes[0],
                Score = 18,
                StartedAt = DateTime.UtcNow.AddHours(-2),
                FinishedAt = DateTime.UtcNow.AddHours(-1),
                UserAnswers = new List<UserAnswer>()
            },
            new QuizAttempt
            {
                User = users[2], // ana
                Quiz = quizzes[3],
                Score = 20,
                StartedAt = DateTime.UtcNow.AddDays(-1).AddHours(-4),
                FinishedAt = DateTime.UtcNow.AddDays(-1).AddHours(-2),
                UserAnswers = new List<UserAnswer>()
            }
        };

            await _context.QuizAttempts.AddRangeAsync(quizAttempts);

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Log the exception (you can use any logging framework you prefer)
            Console.WriteLine($"Error during data seeding: {ex.Message}");
            throw;
        }
    }
}