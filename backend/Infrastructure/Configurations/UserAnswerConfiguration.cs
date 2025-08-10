using KvizHub.Domain.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class UserAnswerConfiguration : IEntityTypeConfiguration<UserAnswer>
{
    public void Configure(EntityTypeBuilder<UserAnswer> builder)
    {
        builder.HasKey(ua => ua.Id);

        builder.Property(ua => ua.AnsweredAt)
            .IsRequired();

        builder.Property(ua => ua.TimeTaken)
            .HasConversion(
                v => v.Ticks,
                v => TimeSpan.FromTicks(v));

        builder.HasOne(ua => ua.Question)
            .WithMany(q => q.UserAnswers)
            .HasForeignKey(ua => ua.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ua => ua.Attempt)
            .WithMany(a => a.UserAnswers)
            .HasForeignKey(ua => ua.AttemptId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(ua => ua.AnswerDetails)
            .WithOne(ad => ad.UserAnswer)
            .HasForeignKey(ad => ad.UserAnswerId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}