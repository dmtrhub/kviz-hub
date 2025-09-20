using KvizHub.Domain.Entities.Quizzes;
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

        builder.Property(le => le.AchievedAt)
            .IsRequired();

        builder.HasOne(le => le.User)
            .WithMany(u => u.LeaderboardEntries)
            .HasForeignKey(le => le.UserId);

        builder.HasOne(le => le.Quiz)
            .WithMany(q => q.LeaderboardEntries)
            .HasForeignKey(le => le.QuizId);
    }
}