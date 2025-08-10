using KvizHub.Domain.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class QuizAttemptConfiguration : IEntityTypeConfiguration<QuizAttempt>
{
    public void Configure(EntityTypeBuilder<QuizAttempt> builder)
    {
        builder.HasKey(qa => qa.Id);

        builder.Property(qa => qa.StartedAt)
            .IsRequired();

        builder.Property(qa => qa.ScorePercentage)
            .HasColumnType("decimal(5,2)");

        builder.HasMany(qa => qa.UserAnswers)
            .WithOne(ua => ua.Attempt)
            .HasForeignKey(ua => ua.AttemptId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
