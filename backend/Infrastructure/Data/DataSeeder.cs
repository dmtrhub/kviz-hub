using KvizHub.Domain.Entities.Quizzes;
using KvizHub.Domain.Entities.Users;
using KvizHub.Domain.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace KvizHub.Infrastructure.Data;

public class DataSeeder(ApplicationDbContext context, ILogger<DataSeeder> logger)
{
    public async Task SeedAsync()
    {
        if (!await context.Database.CanConnectAsync())
        {
            logger.LogWarning("Cannot connect to database. Skipping seed.");
            return;
        }

        await EnsureDefaultUsersAsync();
        await SeedQuizCatalogAsync();
    }

    private async Task EnsureDefaultUsersAsync()
    {
        var defaultUsers = new[]
        {
            (Username: "admin", Email: "admin@kvizhub.com", Role: UserRole.Admin, Password: "Admin123!"),
            (Username: "dmtr", Email: "dmtr@kvizhub.com", Role: UserRole.User, Password: "User123!"),
            (Username: "marija", Email: "marija@kvizhub.com", Role: UserRole.User, Password: "User123!")
        };

        foreach (var user in defaultUsers)
        {
            var exists = await context.Users.AnyAsync(u => u.Username == user.Username);
            if (exists)
            {
                continue;
            }

            context.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password)
            });
        }

        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }
    }

    private async Task SeedQuizCatalogAsync()
    {
        var categorySeeds = BuildCategorySeeds();
        var quizSeeds = BuildQuizSeeds();

        ValidateSeedDefinitions(quizSeeds);

        if (await IsTargetCatalogAlreadySeededAsync(categorySeeds, quizSeeds))
        {
            logger.LogInformation("Quiz catalog already seeded with target real-world data.");
            return;
        }

        await ClearQuizCatalogAsync();

        await context.Categories.AddRangeAsync(categorySeeds);
        await context.SaveChangesAsync();

        var categoriesByName = categorySeeds.ToDictionary(c => c.Name, c => c);

        var quizzes = quizSeeds
            .Select(seed => BuildQuizEntity(seed, categoriesByName[seed.CategoryName]))
            .ToList();

        await context.Quizzes.AddRangeAsync(quizzes);
        await context.SaveChangesAsync();

        logger.LogInformation("Seed completed: 5 categories, 20 quizzes, 3 questions per quiz.");
    }

    private async Task<bool> IsTargetCatalogAlreadySeededAsync(
        IReadOnlyCollection<Category> categorySeeds,
        IReadOnlyCollection<QuizSeed> quizSeeds)
    {
        var categoryCount = await context.Categories.CountAsync();
        var quizCount = await context.Quizzes.CountAsync();
        var questionCount = await context.Questions.CountAsync();

        if (categoryCount != categorySeeds.Count || quizCount != quizSeeds.Count || questionCount != quizSeeds.Count * 3)
        {
            return false;
        }

        var existingCategoryNames = await context.Categories
            .Select(c => c.Name)
            .ToListAsync();

        var existingQuizTitles = await context.Quizzes
            .Select(q => q.Title)
            .ToListAsync();

        var missingCategory = categorySeeds.Select(c => c.Name).Except(existingCategoryNames).Any();
        var missingQuiz = quizSeeds.Select(q => q.Title).Except(existingQuizTitles).Any();

        var existingQuestionTypes = await context.Questions
            .Select(q => q.Type)
            .Distinct()
            .ToListAsync();

        var requiredQuestionTypes = new[]
        {
            QuestionType.SingleChoice,
            QuestionType.MultipleChoice,
            QuestionType.TrueFalse,
            QuestionType.FillInBlank
        };

        var missingQuestionType = requiredQuestionTypes.Except(existingQuestionTypes).Any();

        return !missingCategory && !missingQuiz && !missingQuestionType;
    }

    private async Task ClearQuizCatalogAsync()
    {
        await context.UserAnswerDetails.ExecuteDeleteAsync();
        await context.UserAnswers.ExecuteDeleteAsync();
        await context.LeaderboardEntries.ExecuteDeleteAsync();
        await context.QuizAttempts.ExecuteDeleteAsync();
        await context.QuizCategories.ExecuteDeleteAsync();
        await context.AnswerOptions.ExecuteDeleteAsync();
        await context.Questions.ExecuteDeleteAsync();
        await context.Quizzes.ExecuteDeleteAsync();
        await context.Categories.ExecuteDeleteAsync();
    }

    private static Quiz BuildQuizEntity(QuizSeed seed, Category category)
    {
        return new Quiz
        {
            Title = seed.Title,
            Description = seed.Description,
            Difficulty = seed.Difficulty,
            TimeLimit = seed.TimeLimit,
            QuizCategories = new List<QuizCategory>
            {
                new() { Category = category }
            },
            Questions = seed.Questions.Select(question => new Question
            {
                Text = question.Text,
                Type = question.Type,
                Points = question.Points,
                AnswerOptions = question.Options.Select(option => new AnswerOption
                {
                    Text = option.Text,
                    IsCorrect = option.IsCorrect
                }).ToList()
            }).ToList()
        };
    }

    private static List<Category> BuildCategorySeeds()
    {
        return
        [
            new Category { Name = "History", Description = "Events, people, and periods from world and Serbian history." },
            new Category { Name = "Geography", Description = "Capitals, landforms, climate, and geographic concepts." },
            new Category { Name = "Science", Description = "Physics, chemistry, biology, and astronomy." },
            new Category { Name = "Technology", Description = "Computers, internet, networks, and programming." },
            new Category { Name = "Sports", Description = "Rules, competitions, and sports history." }
        ];
    }

    private static List<QuizSeed> BuildQuizSeeds()
    {
        return
        [
            Quiz(
                categoryName: "History",
                title: "Ancient Civilization",
                description: "Basic questions about Ancient Greece and Rome.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("In which city is the Colosseum located?", "Rome", "Athens", "Carthage", "Milan"),
                    TrueFalse("The Iliad is an epic traditionally attributed to Homer.", true),
                    FillInBlank("Which city-state was known for military training in Ancient Greece?", "Sparta")
                ]),
            Quiz(
                categoryName: "History",
                title: "Medieval Europe",
                description: "Key events and figures of the Middle Ages.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("In which year did the Battle of Hastings take place?", "1066", "1215", "1099", "1453"),
                    TrueFalse("The term 'Black Death' is used for the 14th-century plague pandemic.", true),
                    MultipleChoice(
                        "Which outcomes are associated with the Crusades?",
                        "Growth of trade between Europe and the East",
                        "Stronger cultural exchange",
                        "Abolition of the papacy",
                        "Fall of Constantinople in 1204 to the Ottomans"
                    )
                ]),
            Quiz(
                categoryName: "History",
                title: "19th Century Serbian History",
                description: "Uprisings, reforms, and international recognition of Serbia.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("In which year did the First Serbian Uprising begin?", "1804", "1815", "1830", "1878"),
                    SingleChoice("In which year was the Sretenje Constitution adopted?", "1835", "1829", "1848", "1867"),
                    SingleChoice("At which congress was Serbia internationally recognized as independent?", "Congress of Berlin", "Congress of Vienna", "Paris Peace Conference", "Yalta Conference")
                ]),
            Quiz(
                categoryName: "History",
                title: "World War II",
                description: "Key dates and facts of World War II.",
                difficulty: Difficulty.Hard,
                timeLimit: 10,
                questions:
                [
                    SingleChoice("The invasion of which country started World War II in Europe?", "Poland", "France", "Belgium", "Norway"),
                    SingleChoice("In which year did D-Day happen?", "1944", "1942", "1940", "1945"),
                    SingleChoice("In which year were the United Nations founded?", "1945", "1943", "1946", "1950")
                ]),

            Quiz(
                categoryName: "Geography",
                title: "World Capitals",
                description: "Capitals of countries from different continents.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("What is the capital of Australia?", "Canberra", "Sydney", "Melbourne", "Perth"),
                    SingleChoice("What is the capital of Canada?", "Ottawa", "Toronto", "Vancouver", "Montreal"),
                    SingleChoice("What is the capital of Brazil?", "Brasilia", "Rio de Janeiro", "Sao Paulo", "Salvador")
                ]),
            Quiz(
                categoryName: "Geography",
                title: "Rivers and Lakes of Europe",
                description: "The most famous European rivers and lakes.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Into which sea does the Danube flow?", "Black Sea", "Adriatic Sea", "North Sea", "Aegean Sea"),
                    TrueFalse("The Volga is the longest river in Europe.", true),
                    MultipleChoice(
                        "Which rivers flow through Serbia?",
                        "Danube",
                        "Sava",
                        "Thames",
                        "Volta"
                    )
                ]),
            Quiz(
                categoryName: "Geography",
                title: "World Mountains and Peaks",
                description: "The highest peaks and mountain ranges.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("What is the highest peak in the world?", "Everest", "K2", "Kangchenjunga", "Lhotse"),
                    SingleChoice("Aconcagua belongs to which mountain range?", "Andes", "Alps", "Himalayas", "Carpathians"),
                    SingleChoice("Mont Blanc belongs to which mountain range?", "Alps", "Pyrenees", "Apennines", "Dinaric Alps")
                ]),
            Quiz(
                categoryName: "Geography",
                title: "Climate Zones and Biomes",
                description: "Connecting climate types with natural zones.",
                difficulty: Difficulty.Hard,
                timeLimit: 10,
                questions:
                [
                    SingleChoice("Sahara is mostly located in which climate zone?", "Subtropical arid", "Temperate oceanic", "Subpolar", "Equatorial"),
                    SingleChoice("Which biome dominates northern Canada and Siberia?", "Taiga", "Savanna", "Tundra", "Rainforest"),
                    SingleChoice("Mediterranean climate is characterized by:", "Hot dry summers and mild rainy winters", "Cold dry summers and long winters", "Even precipitation all year", "Extremely cold winters and very short summers")
                ]),

            Quiz(
                categoryName: "Science",
                title: "Physics Basics",
                description: "Fundamental concepts of mechanics and electricity.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("What is the SI unit of force?", "Newton", "Joule", "Watt", "Pascal"),
                    TrueFalse("The speed of light in vacuum is approximately 300,000 km/s.", true),
                    FillInBlank("What is the name of the SI unit for electrical resistance?", "ohm")
                ]),
            Quiz(
                categoryName: "Science",
                title: "Chemistry Basics",
                description: "Atoms, compounds, and basic chemical concepts.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("The chemical formula of water is:", "H2O", "CO2", "O2", "NaCl"),
                    SingleChoice("The atomic number of oxygen is:", "8", "6", "10", "16"),
                    SingleChoice("A solution with pH less than 7 is:", "Acidic", "Basic", "Neutral", "Buffer")
                ]),
            Quiz(
                categoryName: "Science",
                title: "Human Body",
                description: "Anatomy and functions of major organs.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("The largest organ of the human body is:", "Skin", "Liver", "Lungs", "Brain"),
                    SingleChoice("Which organ pumps blood through the body?", "Heart", "Kidney", "Pancreas", "Spleen"),
                    SingleChoice("Insulin is produced by:", "Pancreas", "Thyroid gland", "Liver", "Pituitary gland")
                ]),
            Quiz(
                categoryName: "Science",
                title: "Solar System Astronomy",
                description: "Planets and properties of our planetary system.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("What is the largest planet in the Solar System?", "Jupiter", "Saturn", "Neptune", "Earth"),
                    SingleChoice("Which planet is known as the Red Planet?", "Mars", "Venus", "Mercury", "Uranus"),
                    SingleChoice("Which planet has the most prominent rings?", "Saturn", "Jupiter", "Mars", "Venus")
                ]),

            Quiz(
                categoryName: "Technology",
                title: "Computer Networks",
                description: "Core networking and protocol concepts.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Which device connects different networks and routes traffic?", "Router", "Switch", "Repeater", "Modem"),
                    TrueFalse("The default port for HTTPS is 443.", true),
                    MultipleChoice(
                        "Which protocols belong to the application layer?",
                        "HTTP",
                        "SMTP",
                        "ARP",
                        "ICMP"
                    )
                ]),
            Quiz(
                categoryName: "Technology",
                title: "Web Development",
                description: "HTML, CSS, and HTTP basics.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("What does HTML stand for?", "HyperText Markup Language", "High Transfer Machine Language", "Home Tool Markup Language", "Hyperlink and Text Management Language"),
                    SingleChoice("Which CSS property changes text color?", "color", "background-color", "font-style", "text-shadow"),
                    SingleChoice("HTTP status code 404 means:", "Resource not found", "Access forbidden", "Internal server error", "Request completed successfully")
                ]),
            Quiz(
                categoryName: "Technology",
                title: "C# Programming",
                description: "Practical questions about C# and the .NET ecosystem.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Which keyword defines a constant in C#?", "const", "readonly", "static", "sealed"),
                    SingleChoice("Which collection preserves insertion order and allows duplicates?", "List<T>", "HashSet<T>", "Dictionary<TKey,TValue>", "SortedSet<T>"),
                    SingleChoice("Which return type is used for an async method that returns a value?", "Task<T>", "void", "IEnumerable<T>", "Thread")
                ]),
            Quiz(
                categoryName: "Technology",
                title: "Internet Security",
                description: "Basic digital safety and cybersecurity rules.",
                difficulty: Difficulty.Hard,
                timeLimit: 10,
                questions:
                [
                    SingleChoice("What is 2FA?", "An additional identity verification step", "A type of antivirus software", "A data compression method", "A file backup system"),
                    TrueFalse("Phishing messages often imitate legitimate services to steal data.", true),
                    FillInBlank("The abbreviation for two-factor authentication is ___.", "2FA")
                ]),

            Quiz(
                categoryName: "Sports",
                title: "Football",
                description: "Rules and basic facts about football.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("How many players from one team are on the field at kick-off?", "11", "10", "9", "12"),
                    TrueFalse("The FIFA World Cup is held every 4 years.", true),
                    MultipleChoice(
                        "Which national teams have won the FIFA World Cup?",
                        "Brazil",
                        "France",
                        "Norway",
                        "Japan"
                    )
                ]),
            Quiz(
                categoryName: "Sports",
                title: "Basketball",
                description: "Basic rules and terms in basketball.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("How many minutes does a regular NBA game last?", "48", "40", "60", "50"),
                    SingleChoice("How many points is a free throw worth?", "1", "2", "3", "4"),
                    SingleChoice("The FIBA three-point line is approximately:", "6.75 m", "7.24 m", "6.25 m", "5.90 m")
                ]),
            Quiz(
                categoryName: "Sports",
                title: "Olympic Games",
                description: "History and symbols of the Olympic movement.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Where were the first modern Olympic Games held?", "Athens", "Paris", "London", "Rome"),
                    SingleChoice("How many rings are in the Olympic symbol?", "5", "4", "6", "7"),
                    SingleChoice("The official Olympic motto is:", "Citius, Altius, Fortius", "Mens sana in corpore sano", "Veni, vidi, vici", "Carpe diem")
                ]),
            Quiz(
                categoryName: "Sports",
                title: "Tennis Grand Slams",
                description: "Tournaments and rules of major tennis competitions.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("On which surface is Roland Garros played?", "Clay", "Grass", "Hard court", "Carpet"),
                    TrueFalse("Four Grand Slam tournaments are played in one season.", true),
                    FillInBlank("What is the name of the Grand Slam played on grass in London?", "Wimbledon")
                ])
        ];
    }

    private static void ValidateSeedDefinitions(IEnumerable<QuizSeed> quizSeeds)
    {
        foreach (var quiz in quizSeeds)
        {
            if (quiz.Questions.Count != 3)
            {
                throw new InvalidOperationException($"Quiz '{quiz.Title}' must have exactly 3 questions.");
            }

            foreach (var question in quiz.Questions)
            {
                if (question.Options.Count < 1)
                {
                    throw new InvalidOperationException($"Question '{question.Text}' must have at least one option.");
                }

                var correctCount = question.Options.Count(option => option.IsCorrect);

                if (question.Type == QuestionType.MultipleChoice)
                {
                    if (correctCount < 2)
                    {
                        throw new InvalidOperationException($"Multiple choice question '{question.Text}' must have at least two correct options.");
                    }

                    continue;
                }

                if (question.Type == QuestionType.TrueFalse)
                {
                    if (question.Options.Count != 2 || correctCount != 1)
                    {
                        throw new InvalidOperationException($"True/False question '{question.Text}' must have exactly two options with one correct.");
                    }

                    continue;
                }

                if (correctCount != 1)
                {
                    throw new InvalidOperationException($"Question '{question.Text}' must have exactly one correct option.");
                }
            }
        }
    }

    private static QuizSeed Quiz(
        string categoryName,
        string title,
        string description,
        Difficulty difficulty,
        int timeLimit,
        IReadOnlyList<QuestionSeed> questions)
    {
        return new QuizSeed(categoryName, title, description, difficulty, timeLimit, questions);
    }

    private static QuestionSeed SingleChoice(
        string text,
        string correctOption,
        string wrongOptionA,
        string wrongOptionB,
        string wrongOptionC,
        int points = 5)
    {
        return new QuestionSeed(
            text,
            points,
            QuestionType.SingleChoice,
            new List<OptionSeed>
            {
                new(correctOption, true),
                new(wrongOptionA, false),
                new(wrongOptionB, false),
                new(wrongOptionC, false)
            });
    }

    private static QuestionSeed MultipleChoice(
        string text,
        string correctOptionA,
        string correctOptionB,
        string wrongOptionA,
        string wrongOptionB,
        int points = 5)
    {
        return new QuestionSeed(
            text,
            points,
            QuestionType.MultipleChoice,
            new List<OptionSeed>
            {
                new(correctOptionA, true),
                new(correctOptionB, true),
                new(wrongOptionA, false),
                new(wrongOptionB, false)
            });
    }

    private static QuestionSeed TrueFalse(string statement, bool isTrue, int points = 5)
    {
        return new QuestionSeed(
            statement,
            points,
            QuestionType.TrueFalse,
            new List<OptionSeed>
            {
                new("True", isTrue),
                new("False", !isTrue)
            });
    }

    private static QuestionSeed FillInBlank(string text, string correctAnswer, int points = 5)
    {
        return new QuestionSeed(
            text,
            points,
            QuestionType.FillInBlank,
            new List<OptionSeed>
            {
                new(correctAnswer, true)
            });
    }

    private sealed record QuizSeed(
        string CategoryName,
        string Title,
        string Description,
        Difficulty Difficulty,
        int TimeLimit,
        IReadOnlyList<QuestionSeed> Questions);

    private sealed record QuestionSeed(
        string Text,
        int Points,
        QuestionType Type,
        IReadOnlyList<OptionSeed> Options);

    private sealed record OptionSeed(string Text, bool IsCorrect);
}
