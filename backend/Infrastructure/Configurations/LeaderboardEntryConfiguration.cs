using KvizHub.Domain.Quizzes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class LeaderboardEntryConfiguration : IEntityTypeConfiguration<LeaderboardEntry>
{
    public void Configure(EntityTypeBuilder<LeaderboardEntry> builder)
    {
        builder.HasKey(le => le.Id);

        builder.Property(le => le.Score)
            .IsRequired();

        builder.Property(le => le.CompletedAt)
            .IsRequired();

        builder.Property(le => le.TimeTaken)
            .HasConversion(
                v => v.Ticks,
                v => TimeSpan.FromTicks(v))
            .IsRequired();

        builder.HasIndex(le => new { le.QuizId, le.Score, le.TimeTaken });
    }
}
