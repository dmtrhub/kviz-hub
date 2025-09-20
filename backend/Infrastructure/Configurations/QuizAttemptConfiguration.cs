using KvizHub.Domain.Entities.Quizzes;
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

        builder.HasOne(qa => qa.User)
            .WithMany(u => u.QuizAttempts)
            .HasForeignKey(qa => qa.UserId);

        builder.HasOne(qa => qa.Quiz)
            .WithMany(q => q.QuizAttempts)
            .HasForeignKey(qa => qa.QuizId);
    }
}