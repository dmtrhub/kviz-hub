using KvizHub.Domain.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KvizHub.Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Username)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(u => u.Email)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(u => u.PasswordHash)
               .IsRequired();

        builder.Property(u => u.Role)
               .IsRequired()
               .HasMaxLength(20);

        // Relacije
        builder.HasMany(u => u.QuizAttempts)
               .WithOne(qa => qa.User)
               .HasForeignKey(qa => qa.UserId);

        builder.HasMany(u => u.LeaderboardEntries)
                .WithOne(le => le.User)
                .HasForeignKey(le => le.UserId);
    }
}