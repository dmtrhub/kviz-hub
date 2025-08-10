using KvizHub.Domain.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class QuizConfiguration : IEntityTypeConfiguration<Quiz>
{
    public void Configure(EntityTypeBuilder<Quiz> builder)
    {
        builder.HasKey(q => q.Id);

        builder.Property(q => q.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(q => q.Description)
            .HasMaxLength(500);

        builder.Property(q => q.Difficulty)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(q => q.TimeLimitMinutes)
            .IsRequired();

        builder.HasMany(q => q.Questions)
            .WithOne(q => q.Quiz)
            .HasForeignKey(q => q.QuizId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(q => q.QuizAttempts)
            .WithOne(qa => qa.Quiz)
            .HasForeignKey(qa => qa.QuizId);
    }
}
