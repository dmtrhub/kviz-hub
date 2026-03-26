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
            new Category { Name = "Istorija", Description = "Dogadjaji, licnosti i periodi iz svetske i srpske istorije." },
            new Category { Name = "Geografija", Description = "Prestonice, reljef, klima i geografski pojmovi." },
            new Category { Name = "Nauka", Description = "Fizika, hemija, biologija i astronomija." },
            new Category { Name = "Tehnologija", Description = "Racunari, internet, mreze i programiranje." },
            new Category { Name = "Sport", Description = "Pravila, takmicenja i istorija sporta." }
        ];
    }

    private static List<QuizSeed> BuildQuizSeeds()
    {
        return
        [
            Quiz(
                categoryName: "Istorija",
                title: "Anticka civilizacija",
                description: "Osnovna pitanja o staroj Grckoj i Rimu.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("U kom gradu se nalazi Koloseum?", "Rim", "Atina", "Kartagina", "Milano"),
                    TrueFalse("Iliada je ep koji se tradicionalno pripisuje Homeru.", true),
                    FillInBlank("Kako se zove grad-drzava poznat po vojnom vaspitanju u staroj Grckoj?", "Sparta")
                ]),
            Quiz(
                categoryName: "Istorija",
                title: "Srednji vek Evrope",
                description: "Klucni dogadjaji i licnosti srednjeg veka.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Bitka kod Hastingsa odigrala se koje godine?", "1066", "1215", "1099", "1453"),
                    TrueFalse("Naziv 'Crna smrt' koristi se za pandemiju kuge u 14. veku.", true),
                    MultipleChoice(
                        "Koje posledice se vezuju za krstaske ratove?",
                        "Razvoj trgovine izmedju Evrope i Istoka",
                        "Jacanje kulturne razmene",
                        "Ukidanje papstva",
                        "Pad Carigrada 1204. pod Osmanlije"
                    )
                ]),
            Quiz(
                categoryName: "Istorija",
                title: "Istorija Srbije 19. veka",
                description: "Ustanci, reforme i medjunarodno priznanje Srbije.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Prvi srpski ustanak podignut je koje godine?", "1804", "1815", "1830", "1878"),
                    SingleChoice("Sretenjski ustav donet je koje godine?", "1835", "1829", "1848", "1867"),
                    SingleChoice("Na kom kongresu je Srbija medjunarodno priznata kao nezavisna?", "Berlinski kongres", "Becki kongres", "Pariska konferencija", "Jaltanska konferencija")
                ]),
            Quiz(
                categoryName: "Istorija",
                title: "Drugi svetski rat",
                description: "Najvazniji datumi i cinjenice Drugog svetskog rata.",
                difficulty: Difficulty.Hard,
                timeLimit: 10,
                questions:
                [
                    SingleChoice("Napadom na koju drzavu je poceo Drugi svetski rat u Evropi?", "Poljsku", "Francusku", "Belgiju", "Norvesku"),
                    SingleChoice("Dan D desio se koje godine?", "1944", "1942", "1940", "1945"),
                    SingleChoice("Ujedinjene nacije osnovane su koje godine?", "1945", "1943", "1946", "1950")
                ]),

            Quiz(
                categoryName: "Geografija",
                title: "Prestonice sveta",
                description: "Prestonice drzava sa razlicitih kontinenata.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("Koji je glavni grad Australije?", "Canberra", "Sydney", "Melbourne", "Perth"),
                    SingleChoice("Koji je glavni grad Kanade?", "Ottawa", "Toronto", "Vancouver", "Montreal"),
                    SingleChoice("Koji je glavni grad Brazila?", "Brasilia", "Rio de Janeiro", "Sao Paulo", "Salvador")
                ]),
            Quiz(
                categoryName: "Geografija",
                title: "Reke i jezera Evrope",
                description: "Najpoznatije evropske reke i jezera.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("U koje more se uliva Dunav?", "Crno more", "Jadransko more", "Severno more", "Egejsko more"),
                    TrueFalse("Volga je najduza reka u Evropi.", true),
                    MultipleChoice(
                        "Koje reke proticu kroz Srbiju?",
                        "Dunav",
                        "Sava",
                        "Temza",
                        "Volta"
                    )
                ]),
            Quiz(
                categoryName: "Geografija",
                title: "Planine i vrhovi sveta",
                description: "Najvisi vrhovi i planinski lanci.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Koji je najvisi vrh sveta?", "Everest", "K2", "Kangchendzonga", "Lhotse"),
                    SingleChoice("U kom planinskom lancu se nalazi Aconcagua?", "Andi", "Alpi", "Himalaji", "Karpati"),
                    SingleChoice("Mont Blanc pripada kom planinskom lancu?", "Alpi", "Pirineji", "Apenini", "Dinaridi")
                ]),
            Quiz(
                categoryName: "Geografija",
                title: "Klimatske zone i biomi",
                description: "Povezivanje klime i prirodnih zona.",
                difficulty: Difficulty.Hard,
                timeLimit: 10,
                questions:
                [
                    SingleChoice("Sahara se nalazi pretezno u kom klimatskom pojasu?", "Subtropskom suvom", "Umerenom okeanskom", "Subpolarnom", "Ekvatorskom"),
                    SingleChoice("Koji biom dominira severom Kanade i Sibira?", "Tajga", "Savana", "Tundra", "Prasuma"),
                    SingleChoice("Mediteransku klimu karakterisu:", "Vruca suva leta i blage kise zime", "Hladna suva leta i duge zime", "Ravnomerne padavine tokom cele godine", "Ekstremno hladne zime i vrlo kratka leta")
                ]),

            Quiz(
                categoryName: "Nauka",
                title: "Osnovi fizike",
                description: "Fundamentalni pojmovi mehanike i elektriciteta.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("Koja je SI jedinica za silu?", "Njutn", "Dzoul", "Vat", "Paskal"),
                    TrueFalse("Brzina svetlosti u vakuumu je priblizno 300000 km/s.", true),
                    FillInBlank("Kako glasi oznaka jedinice za elektricni otpor u SI sistemu?", "om")
                ]),
            Quiz(
                categoryName: "Nauka",
                title: "Osnovi hemije",
                description: "Atomi, jedinjenja i osnovni hemijski pojmovi.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("Hemijska formula vode je:", "H2O", "CO2", "O2", "NaCl"),
                    SingleChoice("Atomski broj kiseonika je:", "8", "6", "10", "16"),
                    SingleChoice("Rastvor sa pH vrednoscu manjom od 7 je:", "Kiseo", "Bazan", "Neutralan", "Pufer")
                ]),
            Quiz(
                categoryName: "Nauka",
                title: "Ljudsko telo",
                description: "Anatomija i funkcije osnovnih organa.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Najveci organ ljudskog tela je:", "Koza", "Jetra", "Pluca", "Mozak"),
                    SingleChoice("Koji organ pumpa krv kroz telo?", "Srce", "Bubreg", "Pankreas", "Slezina"),
                    SingleChoice("Insulin proizvodi:", "Pankreas", "Stitasta zlezda", "Jetra", "Hipofiza")
                ]),
            Quiz(
                categoryName: "Nauka",
                title: "Astronomija Suncevog sistema",
                description: "Planete i osobine naseg planetarnog sistema.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Koja je najveca planeta Suncevog sistema?", "Jupiter", "Saturn", "Neptun", "Zemlja"),
                    SingleChoice("Koja planeta je poznata kao Crvena planeta?", "Mars", "Venera", "Merkur", "Uran"),
                    SingleChoice("Koja planeta ima najizrazenije prstenove?", "Saturn", "Jupiter", "Mars", "Venera")
                ]),

            Quiz(
                categoryName: "Tehnologija",
                title: "Racunarske mreze",
                description: "Osnovni pojmovi umrezavanja i protokola.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Koji uredjaj povezuje razlicite mreze i usmerava saobracaj?", "Ruter", "Svic", "Repeater", "Modem"),
                    TrueFalse("Podrazumevani port za HTTPS je 443.", true),
                    MultipleChoice(
                        "Koji protokoli pripadaju aplikacionom sloju?",
                        "HTTP",
                        "SMTP",
                        "ARP",
                        "ICMP"
                    )
                ]),
            Quiz(
                categoryName: "Tehnologija",
                title: "Web razvoj",
                description: "HTML, CSS i HTTP osnove.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("Skracenica HTML znaci:", "HyperText Markup Language", "High Transfer Machine Language", "Home Tool Markup Language", "Hyperlink and Text Management Language"),
                    SingleChoice("Koja CSS osobina menja boju teksta?", "color", "background-color", "font-style", "text-shadow"),
                    SingleChoice("HTTP status kod 404 oznacava:", "Resurs nije pronadjen", "Zabranjen pristup", "Interna greska servera", "Uspesno izvrsen zahtev")
                ]),
            Quiz(
                categoryName: "Tehnologija",
                title: "Programiranje u C#",
                description: "Prakticna pitanja o jeziku C# i .NET okruzenju.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Koja kljucna rec definise konstantu u C#?", "const", "readonly", "static", "sealed"),
                    SingleChoice("Koja kolekcija cuva redosled ubacivanja i dozvoljava duplikate?", "List<T>", "HashSet<T>", "Dictionary<TKey,TValue>", "SortedSet<T>"),
                    SingleChoice("Koji povratni tip se koristi za async metodu koja vraca rezultat?", "Task<T>", "void", "IEnumerable<T>", "Thread")
                ]),
            Quiz(
                categoryName: "Tehnologija",
                title: "Bezbednost na internetu",
                description: "Osnovna pravila digitalne bezbednosti.",
                difficulty: Difficulty.Hard,
                timeLimit: 10,
                questions:
                [
                    SingleChoice("Sta je 2FA?", "Dodatni korak provere identiteta", "Tip antivirusnog programa", "Metoda kompresije podataka", "Sistem za backup fajlova"),
                    TrueFalse("Phishing poruke cesto oponasaju legitimne servise da bi ukrale podatke.", true),
                    FillInBlank("Skracenica za dvofaktorsku autentikaciju je ___.", "2FA")
                ]),

            Quiz(
                categoryName: "Sport",
                title: "Fudbal",
                description: "Pravila i osnovne cinjenice o fudbalu.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("Koliko igraca jedne ekipe je na terenu na pocetku meca?", "11", "10", "9", "12"),
                    TrueFalse("Svetsko prvenstvo u fudbalu odrzava se na svake 4 godine.", true),
                    MultipleChoice(
                        "Koje reprezentacije su osvajale FIFA Svetsko prvenstvo?",
                        "Brazil",
                        "Francuska",
                        "Norveska",
                        "Japan"
                    )
                ]),
            Quiz(
                categoryName: "Sport",
                title: "Kosarka",
                description: "Osnovna pravila i termini u kosarci.",
                difficulty: Difficulty.Easy,
                timeLimit: 8,
                questions:
                [
                    SingleChoice("Koliko minuta traje regularna NBA utakmica?", "48", "40", "60", "50"),
                    SingleChoice("Koliko poena vredi slobodno bacanje?", "1", "2", "3", "4"),
                    SingleChoice("FIBA linija za tri poena je udaljena priblizno:", "6.75 m", "7.24 m", "6.25 m", "5.90 m")
                ]),
            Quiz(
                categoryName: "Sport",
                title: "Olimpijske igre",
                description: "Istorija i simboli olimpijskog pokreta.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Gde su odrzane prve moderne Olimpijske igre?", "Atina", "Pariz", "London", "Rim"),
                    SingleChoice("Koliko prstenova ima olimpijski simbol?", "5", "4", "6", "7"),
                    SingleChoice("Zvanicni olimpijski moto je:", "Citius, Altius, Fortius", "Mens sana in corpore sano", "Veni, vidi, vici", "Carpe diem")
                ]),
            Quiz(
                categoryName: "Sport",
                title: "Tenis Grand Slam",
                description: "Turniri i pravila najvaznijih teniskih takmicenja.",
                difficulty: Difficulty.Medium,
                timeLimit: 9,
                questions:
                [
                    SingleChoice("Na kojoj podlozi se igra Roland Garros?", "Sljaka", "Trava", "Beton", "Tepih"),
                    TrueFalse("U jednoj sezoni igraju se cetiri Grand Slam turnira.", true),
                    FillInBlank("Kako se zove Grand Slam turnir koji se igra na travi u Londonu?", "Wimbledon")
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
                new("Tacno", isTrue),
                new("Netacno", !isTrue)
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
