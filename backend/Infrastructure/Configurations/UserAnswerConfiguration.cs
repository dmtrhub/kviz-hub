using KvizHub.Domain.Entities.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class UserAnswerConfiguration : IEntityTypeConfiguration<UserAnswer>
{
    public void Configure(EntityTypeBuilder<UserAnswer> builder)
    {
        builder.HasKey(ua => ua.Id);

        builder.HasOne(ua => ua.Question)
            .WithMany(q => q.UserAnswers)
            .HasForeignKey(ua => ua.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ua => ua.QuizAttempt)
            .WithMany(a => a.UserAnswers)
            .HasForeignKey(ua => ua.QuizAttemptId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}